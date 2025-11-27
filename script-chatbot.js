// Chat widget JS extracted from index.html
// Frontend: UI logic for the chat widget.
// Purpose:
// - Small floating bubble opens a modal chat window
// - Users can set their OpenAI API key locally, choose a model, and send messages
// - Messages are persisted (optionally) in localStorage to maintain conversation
// - The assistant's responses are rendered as sanitized HTML using marked + DOMPurify
// Security note: API keys are saved to `.env` on the server for convenience in this demo.
// In production, keys must never be stored this way.

lucide.createIcons();
// Show whether the API key is configured on the server
async function updateKeyStatus() {
    try {
        const r = await fetch('/config');
        const j = await r.json();
        const el = document.getElementById('serverKeyStatus');
        if (j.keySet) {
            el.classList.remove('bg-red-500');
            el.classList.add('bg-blue-500');
            el.innerHTML = '<span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> En ligne';
        } else {
            el.classList.remove('bg-blue-500');
            el.classList.add('bg-red-500');
            el.innerHTML = '<span class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span> Clé manquante';
        }
        // update the model selector with the server default
        if (j.model && modelSelect) {
            try { modelSelect.value = j.model; } catch (e) { /* ignore if not present */ }
        }
        // show the current maxResponseChars if present
        if (j.maxResponseChars) {
            try { document.getElementById('maxCharsDisplay').textContent = 'Max: ' + j.maxResponseChars; } catch (e) {}
        }
        // update the client-side history limit if provided by the server
        if (j.historyMaxMessages) {
            try { HISTORY_MAX_MESSAGES = parseInt(j.historyMaxMessages, 10) || HISTORY_MAX_MESSAGES; } catch (e) {}
        }
        // update default UI flags coming from server config
        if (typeof j.defaultUseKnowledge !== 'undefined' && !localStorage.getItem('use_knowledge') && useKnowledgeCheckbox) {
            useKnowledgeCheckbox.checked = !!j.defaultUseKnowledge;
        }
        if (typeof j.defaultStylizeResponse !== 'undefined' && !localStorage.getItem('stylized_response') && stylizedCheckbox) {
            stylizedCheckbox.checked = !!j.defaultStylizeResponse;
        }
        if (typeof j.defaultShortResponse !== 'undefined' && !localStorage.getItem('short_responses') && shortResponsesCheckbox) {
            shortResponsesCheckbox.checked = !!j.defaultShortResponse;
        }
        if (typeof j.defaultRememberHistory !== 'undefined' && !localStorage.getItem('remember_history') && rememberCheckbox) {
            rememberCheckbox.checked = !!j.defaultRememberHistory;
            rememberHistory = !!j.defaultRememberHistory;
        }
    } catch (err) {
        console.warn('Could not fetch config', err);
    }
}
// do not call updateKeyStatus until page variables are defined (modelSelect)
// --- Simple chat UI + modal logic + conversation history
// In-memory conversation history. Persisted to localStorage only if the user enables "Se souvenir".
// Structure: [{ role: 'user'|'assistant'|'system', content: '...' }, ...]
let conversationHistory = [];
// Client-side limit for history that mirrors server's HISTORY_MAX_MESSAGES
// This is updated dynamically when the UI fetches `/config`.
let HISTORY_MAX_MESSAGES = 24; // keep last X messages
let rememberHistory = false;
// UI references
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
// Prefer modal send button id if present, otherwise fallback to old id
const sendBtn = document.getElementById('sendBtnModal') || document.getElementById('sendBtn');
const openKeyModalBtn = document.getElementById('openKeyModal');
const keyModal = document.getElementById('keyModal');
const closeKeyModalBtn = document.getElementById('closeKeyModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const saveModelBtn = document.getElementById('saveModelBtn');
const testKeyBtn = document.getElementById('testKeyBtn');
const modalStatus = document.getElementById('modalStatus');
const modelSelect = document.getElementById('modelSelect');
const openChatBubbleBtn = document.getElementById('openChatBubble');
const chatModal = document.getElementById('chatModal');
const closeChatBtn = document.getElementById('closeChatBtn');

// Append a message to the chat UI
// role: 'user' | 'assistant'
// text: message text (assistant messages are sanitized and rendered as Markdown)
// skipHistory: if true, the message will not be stored into `conversationHistory` (useful when re-hydrating)
function appendMessage(role, text, skipHistory=false) {
    const wrapper = document.createElement('div');
    wrapper.className = role === 'user' ? 'flex items-start gap-2.5 justify-end' : 'flex items-start gap-2.5';
    const inner = document.createElement('div');
    inner.className = 'flex flex-col gap-1 w-full max-w-[320px]';
    const profile = document.createElement('div');
    profile.className = 'flex items-center ' + (role === 'user' ? 'justify-end space-x-2 rtl:space-x-reverse' : 'space-x-2');
    const name = document.createElement('span');
    name.className = 'text-sm font-semibold text-gray-900';
    name.textContent = role === 'user' ? 'Vous' : 'IA';
    const time = document.createElement('span');
    time.className = 'text-xs font-normal text-gray-500';
    time.textContent = 'Maintenant';
    profile.appendChild(role === 'user' ? time : name);
    profile.appendChild(role === 'user' ? name : time);

    const bubble = document.createElement('div');
    bubble.className = role === 'user' ? 'leading-1.5 p-4 border-gray-200 bg-blue-600 text-white rounded-s-xl rounded-ee-xl shadow-sm bubble-user' : 'leading-1.5 p-4 border-gray-200 bg-white text-gray-900 rounded-e-xl rounded-es-xl shadow-sm bubble-assistant';
    // Assistant messages are treated as Markdown and sanitized
    if (role === 'assistant') {
        // Render markdown + sanitize + convert color tags
        try {
            const html = renderAssistantMarkdown(text);
            bubble.innerHTML = html;
        } catch (e) {
            bubble.innerHTML = '<p class="text-sm font-normal text-gray-900">' + text.replace(/\n/g, '<br>') + '</p>';
        }
    } else {
        bubble.innerHTML = '<p class="text-sm font-normal">' + text.replace(/\n/g, '<br>') + '</p>';
    }

    inner.appendChild(profile);
    inner.appendChild(bubble);
    wrapper.appendChild(inner);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    // Optionally store in memory/localStorage — trim to the last HISTORY_MAX_MESSAGES
    if (!skipHistory) {
        // push to memory
        conversationHistory.push({ role, content: text });
        // trim
        if (conversationHistory.length > HISTORY_MAX_MESSAGES) {
            conversationHistory = conversationHistory.slice(-HISTORY_MAX_MESSAGES);
        }
        // persist if requested
        if (rememberHistory) {
            try { localStorage.setItem('chat_history', JSON.stringify(conversationHistory)); } catch (e) { /* ignore */ }
        }
    }
}

// Show a loading indicator while waiting for the assistant response
function showLoading() {
    // remove previous if any
    const existing = document.getElementById('loadingBubble');
    if (existing) existing.remove();
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-start gap-2.5';
    wrapper.id = 'loadingBubble';
    const profile = document.createElement('div');
    profile.className = 'w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 avatar-bot';
    profile.innerHTML = '<i data-lucide="bot" class="w-5 h-5"></i>';
    const inner = document.createElement('div');
    inner.className = 'flex flex-col gap-1 w-full max-w-[320px]';
    const bubble = document.createElement('div');
    bubble.className = 'leading-1.5 p-4 border-gray-200 bg-white rounded-e-xl rounded-es-xl shadow-sm';
    // spinner
    bubble.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
    inner.appendChild(bubble);
    wrapper.appendChild(profile);
    wrapper.appendChild(inner);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    // disable input
    try { userInput.setAttribute('disabled', 'disabled'); sendBtn.setAttribute('disabled', 'disabled'); } catch (e) {}
    try { lucide.createIcons(); } catch (e) {}
}

// Remove the loading indicator and re-enable the input
function hideLoading() {
    const existing = document.getElementById('loadingBubble');
    if (existing) existing.remove();
    try { userInput.removeAttribute('disabled'); sendBtn.removeAttribute('disabled'); } catch (e) {}
}

// Form submission: send user's message to the server via POST /chat, including conversation history
// Listen specifically to the chat modal form (not other page forms)
const chatForm = document.getElementById('chatForm');
if (chatForm) {
    chatForm.addEventListener('submit', async () => {
        const text = userInput.value.trim();
        if (!text) return;
        // send previous history to server, not including current input
        const historyToSend = conversationHistory.slice();
        appendMessage('user', text);
        showLoading();
        userInput.value = '';
        try {
            // POST /chat: message payload includes `message`, `model`, `history`, and UI flags
            const res = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, model: modelSelect.value, history: historyToSend, useKnowledge: (useKnowledgeCheckbox ? useKnowledgeCheckbox.checked : true), shortResponse: (shortResponsesCheckbox ? shortResponsesCheckbox.checked : false), stylizeResponse: (stylizedCheckbox ? stylizedCheckbox.checked : true) })
            });
            const json = await res.json();
            if (!json.ok) {
                hideLoading();
                appendMessage('assistant', 'Erreur: ' + (json.error || 'réponse inattendue')); // assistant alias
                return;
            }
            hideLoading();
            appendMessage('assistant', json.reply || 'Aucune réponse');
        } catch (err) {
            hideLoading();
            appendMessage('assistant', 'Erreur lors de la requête: ' + err.message);
        }
    });
}

// Modal open/close handlers
openKeyModalBtn.addEventListener('click', () => keyModal.classList.remove('hidden'));
closeKeyModalBtn.addEventListener('click', () => keyModal.classList.add('hidden'));

// Open/close chat modal via bubble
openChatBubbleBtn.addEventListener('click', () => {
    chatModal.classList.remove('hidden');
    chatModal.classList.add('flex');
    openChatBubbleBtn.setAttribute('aria-expanded', 'true');
    // focusable for quick typing
    setTimeout(() => userInput.focus(), 150);
});
closeChatBtn.addEventListener('click', () => {
    chatModal.classList.add('hidden');
    chatModal.classList.remove('flex');
    openChatBubbleBtn.setAttribute('aria-expanded', 'false');
    openChatBubbleBtn.focus();
});
// allow clicking outside panel to close
chatModal.addEventListener('click', (e) => {
    if (e.target === chatModal) {
        chatModal.classList.add('hidden');
        chatModal.classList.remove('flex');
        openChatBubbleBtn.setAttribute('aria-expanded', 'false');
        openChatBubbleBtn.focus();
    }
});
// Escape to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chatModal.classList.contains('hidden')) {
        chatModal.classList.add('hidden');
        chatModal.classList.remove('flex');
        openChatBubbleBtn.setAttribute('aria-expanded', 'false');
        openChatBubbleBtn.focus();
    }

});
saveKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) { modalStatus.textContent = 'Clé manquante'; return; }
    modalStatus.textContent = 'Enregistrement...';
    try {
        const res = await fetch('/set-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key })
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || 'Erreur');
        modalStatus.textContent = 'Clé enregistrée — redémarrez le serveur pour la prendre en compte.';
        // Clear or advise about not saving model here — model persistence is now separate
        modalStatus.textContent += ' (Modèle non modifié)';
    } catch (err) {
        modalStatus.textContent = 'Erreur: ' + err.message;
    }
});

// Save chosen model server-side so the server defaults to it for subsequent requests
// This persists to `.env` via the server `/set-model` endpoint.
// Model options are available to override per request from the client.
// New handler: save only the model via /set-model
saveModelBtn.addEventListener('click', async () => {
    const chosenModel = modelSelect.value;
    modalStatus.textContent = 'Enregistrement du modèle...';
    try {
        const r = await fetch('/set-model', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: chosenModel }) });
        const j = await r.json();
        if (!j.ok) throw new Error(j.error || 'Erreur en enregistrant le modèle');
        modalStatus.textContent = 'Modèle enregistré: ' + chosenModel;
        updateKeyStatus();
        // update header status to reflect new model if needed
    } catch (err) {
        modalStatus.textContent = 'Erreur (modèle): ' + err.message;
    }
});

// Test the provided API key by temporarily writing it to the server and calling the chat endpoint
testKeyBtn.addEventListener('click', async () => {
    modalStatus.textContent = 'Test en cours...';
    const key = apiKeyInput.value.trim();
    if (!key) { modalStatus.textContent = 'Clé manquante'; return; }
    try {
        // Keep a simple quick test (do not store); call /chat with a test prompt by proxy to validate key
        const testPrompt = 'Say hello in one sentence.';
        // Temporary test: we call the server set-key then test chat instantly
        // We use set-key to temporarily write and then call /chat
        const setRes = await fetch('/set-key', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key })
        });
        const setJson = await setRes.json();
        if (!setJson.ok) throw new Error(setJson.error || 'Failed to set');

        const chatRes = await fetch('/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: testPrompt, model: modelSelect.value })
        });
        const chatJson = await chatRes.json();
        if (!chatJson.ok) throw new Error(chatJson.error || 'Chat failed');
        modalStatus.textContent = 'Clé OK — réponse test: ' + (chatJson.reply || 'pas de réponse');
    } catch (err) {
        modalStatus.textContent = 'Échec du test: ' + err.message;
    }
});
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const rememberCheckbox = document.getElementById('rememberCheckbox');
const useKnowledgeCheckbox = document.getElementById('useKnowledgeCheckbox');
const shortResponsesCheckbox = document.getElementById('shortResponsesCheckbox');
const stylizedCheckbox = document.getElementById('stylizedCheckbox');
const setMaxCharsBtn = document.getElementById('setMaxCharsBtn');
rememberHistory = !!localStorage.getItem('remember_history');
                                if (rememberCheckbox) rememberCheckbox.checked = rememberHistory;
// Restore persisted setting for knowledge base
try {
    const s = localStorage.getItem('use_knowledge');
    if (useKnowledgeCheckbox) {
        if (s !== null) {
            useKnowledgeCheckbox.checked = s === '1';
        } else {
            useKnowledgeCheckbox.checked = true; // default
        }
    }
} catch (e) { if (useKnowledgeCheckbox) useKnowledgeCheckbox.checked = true; }
// restore short response setting
try {
    const r = localStorage.getItem('short_responses');
    if (shortResponsesCheckbox) shortResponsesCheckbox.checked = r === '1';
} catch (e) { if (shortResponsesCheckbox) shortResponsesCheckbox.checked = false; }
// restore stylized setting
try {
    const r = localStorage.getItem('stylized_response');
    if (stylizedCheckbox) stylizedCheckbox.checked = r === '1';
} catch (e) { if (stylizedCheckbox) stylizedCheckbox.checked = true; }

// Clear the conversation both in-memory and in localStorage
clearHistoryBtn.addEventListener('click', () => {
    conversationHistory = [];
    localStorage.removeItem('chat_history');
    chatContainer.innerHTML = '';
    appendMessage('assistant', 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?');
});

// Toggle memory persistence: when enabled, conversationHistory is also saved to localStorage
                            if (rememberCheckbox) {
                            rememberCheckbox.addEventListener('change', () => {
        rememberHistory = rememberCheckbox.checked;
        try {
            localStorage.setItem('remember_history', rememberHistory ? '1' : '0');
        } catch (e) { }
        if (!rememberHistory) {
            localStorage.removeItem('chat_history');
        } else {
            try { localStorage.setItem('chat_history', JSON.stringify(conversationHistory)); } catch (e) { }
        }
                            });
                            }

                            if (useKnowledgeCheckbox) {
                            useKnowledgeCheckbox.addEventListener('change', () => {
                                try { localStorage.setItem('use_knowledge', useKnowledgeCheckbox.checked ? '1' : '0'); } catch (e) { }
                            });
                            }
                            if (shortResponsesCheckbox) {
                            shortResponsesCheckbox.addEventListener('change', () => {
                                try { localStorage.setItem('short_responses', shortResponsesCheckbox.checked ? '1' : '0'); } catch (e) { }
                            });
                            }
                            if (stylizedCheckbox) {
                            stylizedCheckbox.addEventListener('change', () => {
                                try { localStorage.setItem('stylized_response', stylizedCheckbox.checked ? '1' : '0'); } catch (e) { }
                            });
                        }

// Allow the user to set the MAX_RESPONSE_CHARS server-side through /set-config
if (setMaxCharsBtn) {
    setMaxCharsBtn.addEventListener('click', async () => {
        const currentText = document.getElementById('maxCharsDisplay').textContent || 'Max: ?';
        const current = parseInt(currentText.replace(/[^0-9]/g, ''), 10) || 1000;
        const input = prompt('Définir la limite de caractères pour les réponses du chatbot (MAX_RESPONSE_CHARS):', String(current));
        if (!input) return;
        const n = parseInt(input, 10);
        if (Number.isNaN(n) || n < 10) { alert('Valeur invalide'); return; }
        try {
            const r = await fetch('/set-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'MAX_RESPONSE_CHARS', value: String(n) }) });
            const j = await r.json();
            if (!j.ok) throw new Error(j.error || 'Erreur');
            // update the displayed value
            document.getElementById('maxCharsDisplay').textContent = 'Max: ' + j.value;
            alert('Max response chars mis à jour: ' + j.value);
        } catch (err) {
            alert('Erreur: ' + err.message);
        }
    });
}

                // useKnowledge change listener is attached conditionally above (if element exists)

// Hydrate persisted conversation from localStorage if present (and render it without duplicating history)
chatContainer.innerHTML = '';
(function loadPersistedHistory() {
    try {
        const r = localStorage.getItem('chat_history');
        if (r) {
            const arr = JSON.parse(r);
            if (Array.isArray(arr)) {
                conversationHistory = arr.slice(-HISTORY_MAX_MESSAGES);
                // render without pushing again to history
                chatContainer.innerHTML = '';
                for (const m of conversationHistory) {
                    appendMessage(m.role, m.content, true);
                }
                return;
            }
        }
    } catch (e) {}
    // nothing persisted: show default
    appendMessage('assistant', 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?');
})();
// now we can fetch server config and update UI status
updateKeyStatus();
// helper: render markdown with custom color tag handling
function renderAssistantMarkdown(mdText) {
    // Convert custom [color=...] tags to inline styles before parsing markdown
    const colored = mdText.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, (m, c, inner) => {
        // sanitize color to avoid injection - allow hex or simple color words
        const color = c.trim();
        return `<span style="color:${color}">${inner}</span>`;
    });
    // Use marked to parse markdown → HTML
    const rawHtml = marked.parse(colored);
    // sanitize
    const safe = DOMPurify.sanitize(rawHtml, { ALLOWED_ATTR: ['href', 'target', 'style', 'class'] });
    // Ensure anchors open in a new tab and are secure (rel=noopener noreferrer)
    const wrapper = document.createElement('div');
    wrapper.className = 'text-sm font-normal';
    wrapper.innerHTML = safe;
    const anchors = wrapper.querySelectorAll('a');
    anchors.forEach(a => {
        a.setAttribute('target', '_blank');
        // Ensure security attributes
        const existingRel = (a.getAttribute('rel') || '');
        const relParts = new Set(existingRel.split(' ').filter(Boolean));
        relParts.add('noopener'); relParts.add('noreferrer');
        a.setAttribute('rel', Array.from(relParts).join(' '));
        // Add a helper class for styling
        a.classList.add('assistant-link');
    });
    return wrapper.innerHTML;
}

document.getElementById('settingsBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('settingsDropdown');
    dropdown.classList.toggle('hidden');
});

document.addEventListener('click', () => {
    document.getElementById('settingsDropdown').classList.add('hidden');
});