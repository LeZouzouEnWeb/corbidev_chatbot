# Chatbot OpenAI integration

Tiny example that sets up an Express server and a static frontend to chat with an OpenAI chat model.

## Structure du projet

```
/
├─ public/                    # Fichiers statiques (HTML)
│  ├─ index.html             # Interface chatbot
│  ├─ landing-page.html      # Page de présentation
│  └─ assets/
│      └─ images/
├─ src/
│  ├─ css/                   # Styles
│  │   └─ style-chatbot.css
│  ├─ js/                    # Scripts frontend
│  │   ├─ script-chatbot.js
│  │   └─ utils/
│  ├─ server/                # Backend Node.js
│  │   └─ server.js
│  └─ knowledge/             # Base de connaissance RAG
│      ├─ maine-coon.md
│      └─ RAG/
│          ├─ rag-01-base-de-connaissance.md
│          ├─ rag-02-architect-design.md
│          ├─ rag-03-UI_UX_en-taiwling-css-et-chadcn.md
│          ├─ rag-04-expert-fullstack-html-CSS-et-JS.md
│          └─ rag-mutualise.md
├─ package.json
├─ .env                      # Configuration (non versionné)
└─ README.md
```

## Contexte du projet
Ce dépôt est un petit projet de démonstration destiné à montrer comment intégrer un modèle de chat OpenAI dans une application web simple.
L'objectif principal est pédagogique : fournir une base légère (frontend statique + serveur Express) pour expérimenter des flux de conversation, stocker une clé d'API pour le développement local, et montrer comment intégrer une petite base de connaissance (RAG) pour répondre aux questions.

Le projet est orienté formation/atelier — il n'est pas sécurisé pour la production (pas d'authentification, pas de rate-limiting, clés stockées en local pour faciliter les essais).

## Features
- Frontend chat interface (in `public/index.html`) using an OpenAI chat model
- Modal for saving the API key to `.env` on the server (POST /set-key)
- Chat endpoint (POST /chat) that uses `OPENROUTER_API_KEY` from `.env` to call OpenRouter API

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

Le serveur sert les fichiers statiques depuis le dossier `public/` et expose les endpoints API.

## Notes & Security
- Storing API keys in a file (like `.env`) is a convenience for local development; in production prefer secure vaults.
- `.env` is added to .gitignore.
- The server exposes a simple `POST /chat` that forwards messages to OpenRouter; rate limiting/authentication is not implemented in this minimal example.

## Config
  - `OPENROUTER_API_KEY` - your OpenRouter API key (sk-or-...)
  - `OPENROUTER_MODEL` - optional; defaults to `x-ai/grok-4.1-fast:free`
  - `HISTORY_MAX_MESSAGES` - maximum number of previous messages forwarded to the model (default: 24)
  - `MAX_RESPONSE_CHARS` - max allowed characters in assistant replies before truncation (default: 1000)
  - `PORT` - port where the server listens (default: 3000)
  - `DEFAULT_USE_KNOWLEDGE` - default checked state in the UI for using the knowledge base (true/false; default true)
  - `DEFAULT_STYLIZE_RESPONSE` - default checked state for stylized responses (true/false; default true)
  - `DEFAULT_SHORT_RESPONSE` - default checked state for short responses (true/false; default false)
  - `DEFAULT_REMEMBER_HISTORY` - default checked state for remember-history (true/false; default false)
  - `MAX_TOKENS` - tokens used for the completion API call (default 512)

Example `.env` file (dev/test only):

```
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=x-ai/grok-4.1-fast:free
HISTORY_MAX_MESSAGES=24
MAX_RESPONSE_CHARS=1000
PORT=3000
DEFAULT_USE_KNOWLEDGE=true
DEFAULT_STYLIZE_RESPONSE=true
DEFAULT_SHORT_RESPONSE=false
DEFAULT_REMEMBER_HISTORY=false
MAX_TOKENS=512
```

## Architecture

### Frontend (`public/`)
- **index.html** : Interface principale du chatbot avec modal de configuration
- **landing-page.html** : Page de présentation du projet ChatAid
- Les fichiers HTML chargent les ressources depuis `../src/css/` et `../src/js/`

### Backend (`src/server/`)
- **server.js** : Serveur Express qui :
  - Sert les fichiers statiques depuis `public/`
  - Expose les endpoints API (`/chat`, `/set-key`, `/config`, etc.)
  - Charge la base de connaissance depuis `src/knowledge/`
  - Gère la configuration via `.env` à la racine du projet

### Styles (`src/css/`)
- **style-chatbot.css** : Styles pour le widget de chat (glassmorphism, animations, bulles)

### Scripts (`src/js/`)
- **script-chatbot.js** : Logique frontend du chatbot (gestion des messages, localStorage, rendering Markdown)

### Base de connaissance (`src/knowledge/`)
- Fichiers Markdown utilisés pour le RAG (Retrieval-Augmented Generation)
- Chargés par le serveur pour enrichir les réponses de l'assistant

## Bonnes pratiques appliquées

✅ Séparation des responsabilités : frontend (public), backend (src/server), assets (src/css, src/js)
✅ Configuration centralisée via `.env` à la racine
✅ Structure modulaire permettant l'ajout de composants (src/components, src/js/utils)
✅ Chemins relatifs cohérents entre HTML et ressources
✅ Scripts npm configurés pour pointer vers le bon chemin du serveur

## Tâches (To-do / Done)

- [x] Initialiser le projet Node.js (`package.json`) et installer les dépendances
- [x] Mettre en place un serveur Express minimal (`server.js`) avec des endpoints pour configurer la clé et le modèle
- [x] Créer une interface front-end simple (`index.html`) utilisant Tailwind, Lucide pour les icônes, et `marked`/`DOMPurify` pour afficher la sortie Markdown
- [x] Endpoint `POST /set-key` pour écrire la clé OpenRouter dans `.env` et mettre à jour `process.env` en mémoire
- [x] Endpoint `POST /set-model` pour persister un modèle par défaut dans `.env`
- [x] Endpoint `POST /set-config` pour configurer des paramètres comme `MAX_RESPONSE_CHARS`
- [x] Endpoint `POST /chat` pour envoyer les messages au point d'API OpenRouter (proxy)
- [x] Ajouter une petite base de connaissance (RAG) optionnelle dans `knowledge/maine-coon.md` et endpoint `GET /kb` pour l'inspecter
- [x] Mémorisation du contexte (localStorage) et affichage des messages dans l'UI
- [x] Sélecteur de modèle dans l'UI et gestion des préférences côté client
- [x] Refactorisation de l'architecture des fichiers (public/, src/)
- [ ] Ajouter une authentification utilisateur / gestion des sessions (non implémenté)
- [ ] Sécuriser la persistance des clés (ne PAS stocker en clair en production)
- [ ] Ajouter un rate-limiting et des protections anti-abuse côté serveur
- [ ] Ajouter des tests unitaires et CI
