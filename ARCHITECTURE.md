# Architecture du projet Chatbot

## Vue d'ensemble

Ce projet suit une architecture moderne séparant clairement le frontend, le backend et les ressources.

## Structure des dossiers

### `/public` - Frontend statique

Contient tous les fichiers HTML accessibles publiquement :

- `index.html` : Interface principale du chatbot
- `landing-page.html` : Page de présentation/marketing
- `assets/` : Ressources statiques (images, favicon, etc.)

**Serveur** : Express sert ce dossier en tant que fichiers statiques

### `/src` - Code source

#### `/src/css` - Feuilles de style

- `style-chatbot.css` : Styles du widget de chat (glassmorphism, animations, bulles)

**Bonnes pratiques** :

- Variables CSS pour la cohérence (tokens de couleurs, espacements)
- Animations performantes (transform + opacity)
- Responsive mobile-first

#### `/src/js` - Scripts frontend

- `script-chatbot.js` : Logique principale du chatbot
  - Gestion des messages
  - Communication avec l'API backend
  - Persistence localStorage
  - Rendu Markdown + sanitization
- `utils/` : Utilitaires réutilisables (prévu pour extension)

**Bonnes pratiques** :

- ES Modules
- Séparation des responsabilités
- Gestion d'erreurs robuste

#### `/src/server` - Backend Node.js

- `server.js` : Serveur Express
  - Endpoints API (`/chat`, `/set-key`, `/config`, etc.)
  - Proxy vers OpenRouter API
  - Chargement de la base de connaissance
  - Gestion de la configuration

**Endpoints principaux** :

- `POST /chat` : Envoie un message au modèle
- `POST /set-key` : Configure la clé API
- `POST /set-model` : Configure le modèle par défaut
- `GET /config` : Récupère la configuration actuelle
- `POST /set-config` : Met à jour des paramètres runtime

#### `/src/knowledge` - Base de connaissance RAG

- `maine-coon.md` : Base principale sur les Maine Coon
- `rag/` : Bases de connaissances additionnelles
  - `rag-01-base-de-connaissance.md` : Association Chats & Co
  - `rag-02-architect-design.md` : Architecture et design
  - `rag-03-UI_UX_en-taiwling-css-et-chadcn.md` : UI/UX
  - `rag-04-expert-fullstack-html-CSS-et-JS.md` : Full-stack
  - `rag-mutualise.md` : Base mutualisée complète

**Utilisation** :

- Chargé au démarrage du serveur
- Utilisé comme contexte système pour le modèle
- Améliore la pertinence des réponses

#### `/src/components` - Composants réutilisables (prévu)

Dossier réservé pour futurs composants modulaires

## Flux de données

### 1. Requête utilisateur

```text
User → public/index.html → src/js/script-chatbot.js → POST /chat
```

### 2. Traitement backend

```text
POST /chat → src/server/server.js → OpenRouter API → Réponse
```

### 3. Enrichissement RAG

```text
src/knowledge/*.md → Contexte système → Modèle → Réponse enrichie
```

### 4. Affichage

```text
Réponse → script-chatbot.js → Markdown rendering → Affichage dans chat-container
```

## Chemins importants

### Chemins relatifs dans HTML

Les fichiers HTML dans `public/` référencent les ressources via des chemins relatifs :

- CSS : `../src/css/style-chatbot.css`
- JS : `../src/js/script-chatbot.js`

### Chemins dans server.js

Le serveur utilise des chemins relatifs depuis `src/server/` :

- Fichiers statiques : `path.join(__dirname, '..', '..', 'public')`
- Knowledge base : `path.join(__dirname, '..', 'knowledge', 'maine-coon.md')`
- `.env` : `path.join(__dirname, '..', '..', '.env')`

## Configuration

### `.env` (racine du projet)

Fichier de configuration contenant :

- `OPENROUTER_API_KEY` : Clé API OpenRouter
- `OPENROUTER_MODEL` : Modèle par défaut
- `PORT` : Port du serveur (défaut: 3000)
- `MAX_RESPONSE_CHARS` : Limite de caractères des réponses
- `HISTORY_MAX_MESSAGES` : Nombre de messages dans l'historique
- Flags par défaut : `DEFAULT_USE_KNOWLEDGE`, `DEFAULT_STYLIZE_RESPONSE`, etc.

### `package.json`

- `main` : Pointe vers `src/server/server.js`
- `scripts.start` : Lance le serveur
- `scripts.dev` : Mode développement (identique pour l'instant)

## Avantages de cette architecture

✅ **Séparation des responsabilités** : Frontend, backend et données bien séparés
✅ **Scalabilité** : Facile d'ajouter de nouveaux composants ou modules
✅ **Maintenance** : Code organisé et facile à naviguer
✅ **Sécurité** : Configuration sensible dans `.env` (non versionné)
✅ **Performance** : Fichiers statiques servis efficacement par Express
✅ **Extensibilité** : Structure prête pour ajout de tests, CI/CD, etc.

## Prochaines étapes recommandées

1. **Tests** : Ajouter Jest pour tests unitaires
2. **Build** : Ajouter un bundler (Vite, Webpack) pour optimiser le frontend
3. **TypeScript** : Migrer vers TypeScript pour plus de robustesse
4. **Docker** : Containeriser l'application
5. **CI/CD** : Automatiser les déploiements
6. **Authentification** : Ajouter un système d'auth pour sécuriser l'API
7. **Rate limiting** : Protéger contre les abus
8. **Logs structurés** : Winston ou Pino pour meilleure observabilité
