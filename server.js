// Server: express
// Purpose: Provide a tiny backend that proxies requests to the OpenAI API,
// stores a local API key for easier testing (in `.env`) and exposes endpoints
// to configure model, response length, token usage, and other defaults.
//
// The server reads values from `.env` including:
// - OPENAI_API_KEY, OPENAI_MODEL
// - HISTORY_MAX_MESSAGES, MAX_RESPONSE_CHARS, MAX_TOKENS, PORT
// - DEFAULT_USE_KNOWLEDGE, DEFAULT_STYLIZE_RESPONSE, DEFAULT_SHORT_RESPONSE, DEFAULT_REMEMBER_HISTORY
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
// Use the global fetch if available (Node 18+), otherwise default to node-fetch
let fetch;
if (global.fetch) {
  fetch = global.fetch;
} else {
  fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
}
require('dotenv').config();

const app = express();
// Helper to get the maximum number of messages to forward to the model as history.
// This reads `HISTORY_MAX_MESSAGES` from process.env so it can be updated at runtime.
function getHistoryMax() {
  return parseInt(process.env.HISTORY_MAX_MESSAGES || '24', 10);
}
const PORT = process.env.PORT || 3000;
const ENV_PATH = path.join(__dirname, '.env');

// Helper to read boolean-like env values: '1'|'true' -> true, otherwise false
function boolEnv(name, defaultValue) {
  const v = process.env[name];
  if (v === undefined) return defaultValue;
  return v === '1' || v.toLowerCase() === 'true';
}

// Number of tokens to request from the OpenAI completions endpoint
function getMaxTokens() {
  return parseInt(process.env.MAX_TOKENS || '512', 10);
}

// Parse an env variable RESOURCE_SITES which contains name|url pairs separated by semicolons
// Example: RESOURCE_SITES="Wikipédia|https://fr.wikipedia.org;Royal Canin|https://www.royalcanin.com/fr"
function getResourceSites() {
  const raw = process.env.RESOURCE_SITES;
  if (!raw || typeof raw !== 'string') {
    // sensible defaults for general guidance (non-medical, general resources)
    return [
      { name: 'Wikipédia (FR)', url: 'https://fr.wikipedia.org' },
      { name: 'Royal Canin (FR) - conseils animaux', url: 'https://www.royalcanin.com/fr' },
      { name: 'Recherche Google (vétérinaire/local)', url: 'https://www.google.com/search?q=v%C3%A9t%C3%A9rinaire+France' },
    ];
  }
  return raw.split(';').map(part => {
    const p = part.split('|');
    return { name: (p[0] || '').trim(), url: (p[1] || '').trim() };
  }).filter(r => r.name && r.url);
}

// Small helper to detect if the user's message references 'chien' (dog) or 'chat' (cat)
function detectAnimalFromMessage(s) {
  if (!s || typeof s !== 'string') return null;
  const text = s.toLowerCase();
  if (/\bchien(s)?\b|\bdog(s)?\b|\bcanin\b/.test(text)) return 'dog';
  if (/\bchat(s)?\b|\bmaine[- ]coon\b|\bfelin\b|\bfélin\b/.test(text)) return 'cat';
  return null;
}

// Build a short, readable fallback message with action suggestions and resource links
function buildFallbackMessage(userMessage, stylize = true) {
  const defaultSites = getResourceSites();
  const msgLower = (userMessage || '').toLowerCase();
  const contextual = [];
  if (msgLower.includes('maine coon') || msgLower.includes('maine-coon') || msgLower.includes('mainecoon')) {
    contextual.push({ name: 'Maine Coon — Wikipédia (FR)', url: 'https://fr.wikipedia.org/wiki/Maine_Coon' });
  }
  if (msgLower.includes('chat') || msgLower.includes('chats') || msgLower.includes('félin') || msgLower.includes('féline')) {
    contextual.push({ name: 'Chat — Wikipédia (FR)', url: 'https://fr.wikipedia.org/wiki/Chat' });
  }
  const sites = [...contextual, ...defaultSites].slice(0, 6);
  const sitesText = sites.map(s => `- [${s.name}](${s.url})`).join('\n');
  const title = stylize ? `[color=#1E90FF]**Information hors-base**[/color]` : `**Information hors-base**`;
  const resourcesTitle = stylize ? `[color=#16A34A]**Ressources utiles :**[/color]` : `**Ressources utiles :**`;
  const lines = [
    `${title}`,
    `Je suis spécialisé(e) sur les chats (Maine Coon) et je ne trouve pas d'information précise sur ce point dans la base. 😊`,
    `Souhaitez-vous que je :`,
    `- **Proposer** une réponse générale (hors-base, non vérifiée)`,
    `- **Rechercher** des sujets proches dans la base`,
    `- **Poser** une question pour préciser votre besoin`,
    `\n${resourcesTitle}`,
    `${sitesText}`,
  ];
  if (stylize) {
    // Make a small footer hint in muted color
    lines.push('', `[color=#6B7280]_Je peux aussi fournir des liens externes ou une réponse courte si vous le souhaitez._[/color]`);
  }
  return lines.join('\n');
}

// Load knowledge files for RAG (optional)
// Optional RAG (retrieval-augmented generation) knowledge base. This file is used
// as a system message to the model to bias the assistant's answers when `useKnowledge` is true.
let knowledgeBase = null;
try {
  const kbPath = path.join(__dirname, 'knowledge', 'maine-coon.md');
  if (fs.existsSync(kbPath)) {
    knowledgeBase = fs.readFileSync(kbPath, 'utf-8');
    console.log('Knowledge base loaded: Maine Coon');
  }
} catch (err) {
  console.warn('Could not load knowledge base', err);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Dynamically read the max response chars from env
// Read the configured max allowed response length for assistant replies.
// This value is stored as a numeric string in process.env or defaults to 1000.
function getMaxResponseChars() {
  return parseInt(process.env.MAX_RESPONSE_CHARS || '1000', 10);
}

// Helper to set env entries safely (only OPENAI_API_KEY for now)
// Persist a key/value into `.env` safely. Currently used for OPENAI_API_KEY and OPENAI_MODEL.
// This is intentionally minimal: it overwrites or appends a single value in `.env`.
// Security note: Writing secrets to `.env` is only suitable for local development.
function setEnv(key, value) {
  let content = '';
  try {
    if (fs.existsSync(ENV_PATH)) {
      content = fs.readFileSync(ENV_PATH, 'utf-8');
    }
  } catch (err) {
    console.error('Error reading .env:', err);
  }

  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    if (content && content[content.length - 1] !== '\n') content += '\n';
    content += `${key}=${value}\n`;
  }

  fs.writeFileSync(ENV_PATH, content, 'utf-8');
}

// POST /set-key
// Body: { key: string }
// Persists the provided OpenAI API key to `.env` and updates process.env so the server
// can use it without a restart. Returns { ok: true } on success.
app.post('/set-key', (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ ok: false, error: 'API key missing' });

  try {
    setEnv('OPENAI_API_KEY', key);
    // Update in-memory env value so the server can use it immediately (no restart required)
    process.env.OPENAI_API_KEY = key;
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to write .env' });
  }
});

// Set the default model used by the server (persist to .env and update process.env)
// POST /set-model
// Body: { model: string }
// Saves and activates the default model used by the server for outgoing calls.
app.post('/set-model', (req, res) => {
  const { model } = req.body;
  if (!model) return res.status(400).json({ ok: false, error: 'Model missing' });
  try {
    setEnv('OPENAI_MODEL', model);
    process.env.OPENAI_MODEL = model;
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to write .env for model' });
  }
});

// Endpoint to set allowed configuration (e.g., MAX_RESPONSE_CHARS)
// POST /set-config
// Body: { key: string, value: string }
// Allows updating a small set of server-side configuration values at runtime.
// Only `MAX_RESPONSE_CHARS` is allowed in this example to control the assistant's reply length.
app.post('/set-config', (req, res) => {
  const { key, value } = req.body;
  // Allow runtime changes to these keys only
  const allowed = ['MAX_RESPONSE_CHARS', 'HISTORY_MAX_MESSAGES'];
  if (!key || !value) return res.status(400).json({ ok: false, error: 'Missing key or value' });
  if (!allowed.includes(key)) return res.status(400).json({ ok: false, error: 'Setting not allowed' });
  if (key === 'MAX_RESPONSE_CHARS') {
    // Ensure numeric
    const n = parseInt(value, 10);
    if (Number.isNaN(n) || n < 10) return res.status(400).json({ ok: false, error: 'Invalid value' });
    try {
      setEnv(key, String(n));
      process.env[key] = String(n);
      return res.json({ ok: true, key, value: n });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Failed to write .env' });
    }
  }
  if (key === 'HISTORY_MAX_MESSAGES') {
    const n = parseInt(value, 10);
    if (Number.isNaN(n) || n < 1) return res.status(400).json({ ok: false, error: 'Invalid value' });
    try {
      setEnv(key, String(n));
      process.env[key] = String(n);
      return res.json({ ok: true, key, value: n });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Failed to write .env' });
    }
  }
  res.status(400).json({ ok: false, error: 'Unhandled key' });
});

// Chat endpoint - sends message to OpenAI (chat completions)
// POST /chat
// Body: {
//   message: string,
//   history?: Array<{role:string, content:string}>,
//   model?: string, // optional override
//   useKnowledge?: boolean,
//   shortResponse?: boolean,
//   stylizeResponse?: boolean
// }
// Forwards the message (with bounded history) to OpenAI's Chat Completions API
// and returns the assistant reply. The server enforces some system prompts and length limits.
app.post('/chat', async (req, res) => {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(400).json({ ok: false, error: 'OpenAI key not configured on server' });

  // Read defaults from environment if the client doesn't specify them
  const envDefaultUseKnowledge = boolEnv('DEFAULT_USE_KNOWLEDGE', true);
  const envDefaultStylize = boolEnv('DEFAULT_STYLIZE_RESPONSE', true);
  const envDefaultShort = boolEnv('DEFAULT_SHORT_RESPONSE', false);
  const { message, history = [], useKnowledge = envDefaultUseKnowledge, shortResponse = envDefaultShort, stylizeResponse = envDefaultStylize } = req.body;
  if (!message) return res.status(400).json({ ok: false, error: 'No message provided' });

  // Sanitize & trim history: ensure only well-formed objects pass through
  let sanitized = [];
  if (Array.isArray(history)) {
    sanitized = history.filter(h => h && typeof h.content === 'string' && typeof h.role === 'string' && ['user','assistant','system'].includes(h.role));
    const max = getHistoryMax();
    if (sanitized.length > max) sanitized = sanitized.slice(-max);
  }

  // Quick check: if the user asks about dogs but our KB is about cats, return a concise fallback
  const userMention = detectAnimalFromMessage(message);
  if (userMention === 'dog' && useKnowledge && knowledgeBase && knowledgeBase.toLowerCase().includes('maine coon')) {
    const fallback = buildFallbackMessage(message, stylizeResponse);
    return res.json({ ok: true, reply: fallback, data: null });
  }

  // System message(s): provide constraints, language, and maximum characters
  const messages = [];
  // System constraints: prefer helpful guidance rather than blunt refusals
  // - If the exact info isn't in the knowledge base, be polite and helpful:
  //   1) explain that the base doesn't contain the requested information;
  //   2) offer a short suggestion: propose related items from the base, ask a clarifying question,
  //      or give a succinct general answer marked as "hors base" (non vérifiée);
  //   3) never use a blunt single-line "Information non disponible dans la base." as the only reply;
  // - Always respond in French, add at least one emoji, and keep length within MAX_RESPONSE_CHARS.
  const systemConstraints = `Tu es un assistant en français. RÉPONDS DE FAÇON CONCISE (3 courts paragraphes max). Si l'information demandée n'est pas trouvée dans la base de connaissance fournie :
  1) Indique poliment que la base ne contient pas cette information.
  2) Propose au moins une action utile (ex : demander une clarification, proposer une question alternative, ou donner une réponse générale clairement marquée comme "hors base"/approximative).
  3) Si possible, propose du contenu connexe tiré de la base et demande si l'utilisateur souhaite approfondir.
  Réponse maximum ${getMaxResponseChars()} caractères. Ajoute au moins un emoji pertinent. Sépare chaque paragraphe par une ligne vide. Ne mélange pas les sujets : si l'utilisateur parle de "chien(s)", rappelle que ta base est centrée sur les chats (Maine Coon) et demande si l'utilisateur souhaite une réponse hors-base ou des ressources externes.`;
  messages.push({ role: 'system', content: systemConstraints });
  if (stylizeResponse) {
    messages.push({ role: 'system', content: "Utilise Markdown pour la mise en forme, et ajoute des emojis quand c'est pertinent. Pour les couleurs, le front-end accepte un tag [color=COLOR]Texte[/color] (COLOR est un nom CSS ou hex)." });
  }
  // Optionally prepend the knowledge base as an additional system message to bias answers
  if (useKnowledge && knowledgeBase) {
    messages.push({ role: 'system', content: `Base de connaissance - Les Maine Coons:\n\n${knowledgeBase}` });
  }
  // include any sanitized system or other messages from history
  messages.push(...sanitized);
  // finally the user message
  messages.push({ role: 'user', content: message });
  // Accept optional model from client; fallback to env var or default (gpt-4o-mini)
  const model = req.body.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: getMaxTokens(),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ ok: false, error: 'OpenAI error: ' + text });
    }

    const data = await response.json();
    // Based on OpenAI Chat Completions v1 spec
    let reply = (data.choices && data.choices[0] && data.choices[0].message) ? data.choices[0].message.content : null;
    // Post-process the reply to enforce constraints in case the model didn't follow them
    function formatReply(raw, userMessage, stylize) {
      if (!raw || typeof raw !== 'string') return raw;
      // normalize CRLF
      let r = raw.replace(/\r\n/g, '\n');
      // ensure paragraph breaks
      r = r.replace(/\n{1}/g, '\n\n');
      // ensure there is at least one emoji (basic test)
      const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}]/u;
      if (!emojiRegex.test(r)) r = '🐱 ' + r;
      // enforce MAX_RESPONSE_CHARS (count code points)
      const max = getMaxResponseChars();
      const cps = Array.from(r);
      if (cps.length > max) {
        const truncated = cps.slice(0, max - 3).join('');
        r = truncated + '...';
      }
      // If the response is a short rejection like 'Information non disponible dans la base',
      // transform it into a more useful, oriented message for the user.
      const noInfoRegex = /information non disponible dans la base|information non présente|non disponible dans la base|information introuvable|je ne trouve pas d'information/i;
      // fallback precomputations used for mismatch and no-info messages
      const defaultSitesFallback = getResourceSites();
      const msgLowerFallback = (userMessage || raw || '').toLowerCase();
      const contextualFallback = [];
      if (msgLowerFallback.includes('maine coon') || msgLowerFallback.includes('maine-coon') || msgLowerFallback.includes('mainecoon')) {
        contextualFallback.push({ name: 'Maine Coon — Wikipédia (FR)', url: 'https://fr.wikipedia.org/wiki/Maine_Coon' });
      }
      if (msgLowerFallback.includes('chat') || msgLowerFallback.includes('chats') || msgLowerFallback.includes('félin') || msgLowerFallback.includes('féline')) {
        contextualFallback.push({ name: 'Chat — Wikipédia (FR)', url: 'https://fr.wikipedia.org/wiki/Chat' });
      }
      const sitesFallback = [...contextualFallback, ...defaultSitesFallback].slice(0, 6);
      const sitesTextFallback = sitesFallback.map(s => `- [${s.name}](${s.url})`).join('\n');
      const altLinesFallback = [
        `Je suis spécialisé(e) sur les chats (Maine Coon) et je ne trouve pas d'information précise sur ce point dans la base. 😊`,
        `Souhaitez-vous que je :`,
        `- propose une réponse générale (hors-base, non vérifiée)`,
        `- recherche des sujets proches dans la base`,
        `- vous pose une question pour préciser votre besoin`,
        `\nRessources utiles :`,
        `${sitesTextFallback}`
      ];
      const altFallback = altLinesFallback.join('\n');
      if (noInfoRegex.test(r)) {
        // If the user asked about dogs but our KB is about cats, explicitly state the mismatch
        const mention = detectAnimalFromMessage(userMessage);
        if (mention === 'dog' && knowledgeBase && knowledgeBase.toLowerCase().includes('maine coon')) {
          const mismatchMsg = `Je remarque que votre question porte sur un chien, alors que ma base est consacrée aux chats (Maine Coon). Souhaitez-vous que je :`;
          // Prepend mismatch message but keep everything concise
          const newAlt = mismatchMsg + '\n\n' + buildFallbackMessage(userMessage, !!stylize);
          const newAltCps = Array.from(newAlt);
          if (newAltCps.length > max) return newAltCps.slice(0, max - 3).join('') + '...';
          return newAlt;
        }
        // Build a helpful, action-oriented suggestion in French
        const defaultSites = getResourceSites();
        // Add contextual site if the user asked about "Maine Coon" or "chat"
        const msgLower = (raw || '').toLowerCase();
        const contextual = [];
        if (msgLower.includes('maine coon') || msgLower.includes('maine-coon') || msgLower.includes('mainecoon')) {
          contextual.push({ name: 'Maine Coon — Wikipédia (FR)', url: 'https://fr.wikipedia.org/wiki/Maine_Coon' });
        }
        if (msgLower.includes('chat') || msgLower.includes('chats') || msgLower.includes('félin') || msgLower.includes('féline')) {
          contextual.push({ name: 'Chat — Wikipédia (FR)', url: 'https://fr.wikipedia.org/wiki/Chat' });
        }
        const sites = [...contextual, ...defaultSites].slice(0, 6);
        // Use Markdown-style links so they render nicely in the front-end
        const sitesText = sites.map(s => `• [${s.name}](${s.url})`).join('\n');
        // Use the concise fallback message created from userMessage
        const alt = buildFallbackMessage(userMessage, !!stylize);
        // keep short and compliant to max length
        const altCps = Array.from(alt);
        if (altCps.length > max) {
          return altCps.slice(0, max - 3).join('') + '...';
        }
        return alt;
      }
      return r;
    }
    const finalReply = formatReply(reply, message, stylizeResponse);
    // Return a trimmed and constrained reply: keep raw response and the original data for debugging
    res.json({ ok: true, reply: finalReply, data });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ ok: false, error: 'Chat request failed' });
  }
});

app.get('/config', (req, res) => {
  res.json({
    ok: true,
    keySet: !!process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || null,
    maxResponseChars: getMaxResponseChars(),
    historyMaxMessages: getHistoryMax(),
    port: process.env.PORT || PORT,
    defaultUseKnowledge: boolEnv('DEFAULT_USE_KNOWLEDGE', true),
    defaultStylizeResponse: boolEnv('DEFAULT_STYLIZE_RESPONSE', true),
    defaultShortResponse: boolEnv('DEFAULT_SHORT_RESPONSE', false),
    defaultRememberHistory: boolEnv('DEFAULT_REMEMBER_HISTORY', false),
    maxTokens: getMaxTokens(),
  });
});

// Optional endpoint to inspect the loaded knowledge base
app.get('/kb', (req, res) => {
  res.json({ ok: true, loaded: !!knowledgeBase, content: knowledgeBase || null });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
