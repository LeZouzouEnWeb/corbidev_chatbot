# Chatbot OpenAI integration

Tiny example that sets up an Express server and a static frontend to chat with an OpenAI chat model.

## Contexte du projet
Ce dépôt est un petit projet de démonstration destiné à montrer comment intégrer un modèle de chat OpenAI dans une application web simple.
L'objectif principal est pédagogique : fournir une base légère (frontend statique + serveur Express) pour expérimenter des flux de conversation, stocker une clé d'API pour le développement local, et montrer comment intégrer une petite base de connaissance (RAG) pour répondre aux questions.

Le projet est orienté formation/atelier — il n'est pas sécurisé pour la production (pas d'authentification, pas de rate-limiting, clés stockées en local pour faciliter les essais).

## Features
- Frontend chat interface (in `index.html`) using an OpenAI chat model
- Modal for saving the API key to `.env` on the server (POST /set-key)
- Chat endpoint (POST /chat) that uses `OPENAI_API_KEY` from `.env` to call OpenAI

## Run locally
1) Ensure Node.js installed.
2) Install dependencies:

```powershell
npm install
```

3) Start the server:

```powershell
npm start
```

4) Open the app: http://localhost:3000

## Notes & Security
- Storing API keys in a file (like `.env`) is a convenience for local development; in production prefer secure vaults.
- `.env` is added to .gitignore.
- The server exposes a simple `POST /chat` that forwards messages to OpenAI; rate limiting/authentication is not implemented in this minimal example.

## Config
  - `OPENAI_API_KEY` - your OpenAI API key (sk-...)
  - `OPENAI_MODEL` - optional; defaults to `gpt-4o-mini` (used if the client doesn't send a model)
  - `HISTORY_MAX_MESSAGES` - maximum number of previous messages forwarded to the model (default: 24)
  - `MAX_RESPONSE_CHARS` - max allowed characters in assistant replies before truncation (default: 1000)
  - `PORT` - port where the server listens (default: 3000)
  - `DEFAULT_USE_KNOWLEDGE` - default checked state in the UI for using the knowledge base (true/false; default true)
  - `DEFAULT_STYLIZE_RESPONSE` - default checked state for stylized responses (true/false; default true)
  - `DEFAULT_SHORT_RESPONSE` - default checked state for short responses (true/false; default false)
  - `DEFAULT_REMEMBER_HISTORY` - default checked state for remember-history (true/false; default false)
  - `MAX_TOKENS` - tokens used for the completion API call (default 512)

You can also choose the model in the web UI: in the "Clé OpenAI" modal, select a model and save it — it will persist to `.env` and be used as the server default. When chatting, the selected model is sent with each request so you can temporarily override the default for a session.
 - Note: Saving your API key and saving the model are separate actions. Click **Enregistrer la clé** to store the key and **Enregistrer le modèle** to persist your chosen model.

Conversation context (mémoire)
- The frontend now stores conversation history and sends it with each message, so the model has access to prior exchanges.
- You can clear history using the 🧹 button in the header.
- Toggle "Se souvenir" to persist the conversation into `localStorage` across page reloads.
  - You can change the model used by the app via the chat UI. In the "Clé OpenAI" modal, select a model and save it — this will set `OPENAI_MODEL` on the server.

Optional config
- `HISTORY_MAX_MESSAGES` : set this environment variable on the server to limit how many prior messages will be accepted and forwarded to the OpenAI API (default 24).
 - `HISTORY_MAX_MESSAGES` : set this environment variable on the server to limit how many prior messages will be accepted and forwarded to the OpenAI API (default 24).
 - `MAX_RESPONSE_CHARS` : maximum characters allowed in assistant replies, will truncate responses if larger (default 1000). Set this value in your `.env` to change the limit.

RESOURCE_SITES & recommandations internet
-----------------------------------------
- Vous pouvez définir `RESOURCE_SITES` dans `.env` comme une liste de paires nom|url séparées par `;` pour personnaliser les sites proposés en cas d'absence d'information :
  - Exemple: `RESOURCE_SITES=Wikipédia (FR)|https://fr.wikipedia.org;Royal Canin (FR)|https://www.royalcanin.com/fr`
- Par défaut, le serveur propose Wikipédia (FR), Royal Canin et une recherche Google pour un vétérinaire local.
- Si le message contient des mots-clés comme `Maine Coon` ou `chat`, le serveur propose automatiquement des liens contextuels (ex. la page Wikipédia correspondante).
 - Si le message contient des mots-clés comme `Maine Coon` ou `chat`, le serveur propose automatiquement des liens contextuels (ex. la page Wikipédia correspondante). Ces liens seront affichés sous forme cliquable dans la discussion.

Comportement quand l'information n'est pas dans la base (RAG)
------------------------------------------------------------
- Le chatbot évite maintenant les réponses trop abruptes comme "Information non disponible dans la base.".
- Si une question n'est pas couverte par la base de connaissance, le chatbot :
  - indique poliment qu'il ne trouve pas d'information dans la base ;
  - propose des choix utiles (ex. : donner une réponse générale non vérifiée, proposer des sujets proches contenus dans la base, ou poser une question de clarification pour mieux cibler la recherche) ;
  - marque explicitement toute information fournise comme "hors base" (approximative) si nécessaire.

Exemple: à la place de "Information non disponible dans la base.", l'assistant répondra quelque chose comme :
> "Je ne trouve pas d'information précise sur ce point dans la base de connaissance. Souhaitez-vous que je propose des éléments généraux (hors base) ou que je vous pose une question pour préciser votre besoin ? 😊"

Example `.env` file (dev/test only):

```
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
HISTORY_MAX_MESSAGES=24
MAX_RESPONSE_CHARS=1000
PORT=3000
DEFAULT_USE_KNOWLEDGE=true
DEFAULT_STYLIZE_RESPONSE=true
DEFAULT_SHORT_RESPONSE=false
DEFAULT_REMEMBER_HISTORY=false
MAX_TOKENS=512
```

You can update the server-side values at runtime using the API (if available):
- POST `/set-key` with body { key } to write the `OPENAI_API_KEY` to `.env` and update process.env
- POST `/set-model` with body { model } to update `OPENAI_MODEL` in `.env` and update process.env
- POST `/set-config` with body { key, value } to update `MAX_RESPONSE_CHARS` and `HISTORY_MAX_MESSAGES` at runtime

Note: Most other defaults are read from `.env` on startup including `DEFAULT_*` flags and `MAX_TOKENS`.

## How it works
- The frontend calls `/set-key` to write the `.env` file.
 - The server updates `process.env.OPENAI_API_KEY` after `/set-key` so new keys are available right away without restart.

To apply changes dynamically, you may restart the server or extend the server to reload env values from disk on each request (fast and minimal change already done in server by reading process.env only at startup - you can adapt to re-read a newly written `.env` if needed).

## Tâches (To-do / Done)
Ci-dessous la liste des tâches du projet et leur état actuel. Les cases cochées ✅ indiquent les éléments déjà implémentés.

- [x] Initialiser le projet Node.js (`package.json`) et installer les dépendances
- [x] Mettre en place un serveur Express minimal (`server.js`) avec des endpoints pour configurer la clé et le modèle
- [x] Créer une interface front-end simple (`index.html`) utilisant Tailwind, Lucide pour les icônes, et `marked`/`DOMPurify` pour afficher la sortie Markdown
- [x] Endpoint `POST /set-key` pour écrire la clé OpenAI dans `.env` et mettre à jour `process.env` en mémoire
- [x] Endpoint `POST /set-model` pour persister un modèle par défaut dans `.env`
- [x] Endpoint `POST /set-config` pour configurer des paramètres comme `MAX_RESPONSE_CHARS`
- [x] Endpoint `POST /chat` pour envoyer les messages au point d'API OpenAI (proxy)
- [x] Ajouter une petite base de connaissance (RAG) optionnelle dans `knowledge/maine-coon.md` et endpoint `GET /kb` pour l'inspecter
- [x] Mémorisation du contexte (localStorage) et affichage des messages dans l'UI
- [x] Sélecteur de modèle dans l'UI et gestion des préférences côté client
- [ ] Ajouter une authentification utilisateur / gestion des sessions (non implémenté)
- [ ] Sécuriser la persistance des clés (ne PAS stocker en clair en production)
- [ ] Ajouter un rate-limiting et des protections anti-abuse côté serveur
- [ ] Ajouter des tests unitaires et CI

## Où j'ai ajouté des commentaires dans le code
J'ai ajouté des commentaires explicatifs pour faciliter la prise en main et la lecture du code :
- `server.js` : en-tête de fichier, utilitaires (`setEnv`, `getMaxResponseChars`), et commentaires au-dessus de chaque endpoint pour expliquer leurs inputs et outputs.
- `index.html` : commentaires sur la structure de l'UI, DOM elements importants, gestion du localStorage, et sur la fonction `renderAssistantMarkdown()` qui convertit les balises `[color=]` en styles inline puis rend le Markdown en HTML sécurisé.

Si vous souhaitez que j'ajoute d'autres sections (par ex. guide de déploiement, architecture, tests), dites-moi lesquelles et je les ajouterai.

# corbidev_chatbot
