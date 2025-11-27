# Structure du projet Chatbot

## Arborescence complète

```
chatbot/
│
├── public/                      # Frontend statique (fichiers HTML)
│   ├── index.html              # Interface principale du chatbot
│   ├── landing-page.html       # Page de présentation
│   └── assets/
│       └── images/             # Images et ressources graphiques
│
├── src/                         # Code source
│   │
│   ├── css/                    # Feuilles de style
│   │   └── style-chatbot.css  # Styles du widget de chat
│   │
│   ├── js/                     # Scripts frontend
│   │   ├── script-chatbot.js  # Logique principale du chatbot
│   │   └── utils/             # Utilitaires réutilisables
│   │
│   ├── server/                 # Backend Node.js/Express
│   │   └── server.js          # Serveur API + proxy OpenRouter
│   │
│   ├── knowledge/              # Base de connaissance RAG
│   │   ├── maine-coon.md      # Base principale Maine Coon
│   │   └── rag/               # Bases additionnelles
│   │       ├── rag-01-base-de-connaissance.md
│   │       ├── rag-02-architect-design.md
│   │       ├── rag-03-UI_UX_en-taiwling-css-et-chadcn.md
│   │       ├── rag-04-expert-fullstack-html-CSS-et-JS.md
│   │       └── rag-mutualise.md
│   │
│   └── components/             # Composants réutilisables (prévu)
│
├── node_modules/               # Dépendances npm (git ignored)
│
├── .vscode/                    # Configuration VS Code
│
├── .env                        # Configuration (git ignored)
├── .gitignore                  # Fichiers à ignorer par git
├── package.json                # Métadonnées et dépendances npm
├── package-lock.json           # Versions exactes des dépendances
│
├── README.md                   # Documentation principale
├── ARCHITECTURE.md             # Documentation de l'architecture
├── MIGRATION.md                # Historique de la refactorisation
└── STRUCTURE.md                # Ce fichier
```

## Détails par dossier

### 📁 `public/` - Frontend statique
**Objectif** : Fichiers HTML servis directement par Express

**Contenu** :
- Pages HTML accessibles publiquement
- Assets statiques (images, favicon, etc.)

**Accès** : http://localhost:3000/ sert ce dossier

---

### 📁 `src/` - Code source

#### 📁 `src/css/` - Styles
**Objectif** : Feuilles de style CSS

**Fichiers** :
- `style-chatbot.css` : Widget de chat avec glassmorphism, animations

**Chargement** : Via `<link>` dans les fichiers HTML avec chemin relatif `../src/css/`

---

#### 📁 `src/js/` - Scripts frontend
**Objectif** : Logique JavaScript côté client

**Fichiers** :
- `script-chatbot.js` : Gestion du chat, API calls, localStorage, Markdown rendering
- `utils/` : Utilitaires partagés (prévu pour extension)

**Chargement** : Via `<script src="../src/js/script-chatbot.js">` dans HTML

---

#### 📁 `src/server/` - Backend
**Objectif** : Serveur Express + API

**Fichiers** :
- `server.js` : 
  - Sert les fichiers statiques depuis `public/`
  - Endpoints API (`/chat`, `/config`, `/set-key`, etc.)
  - Proxy vers OpenRouter API
  - Charge la base de connaissance au démarrage

**Démarrage** : `npm start` lance `node src/server/server.js`

---

#### 📁 `src/knowledge/` - Base de connaissance
**Objectif** : Fichiers Markdown pour RAG (Retrieval-Augmented Generation)

**Utilisation** :
- Chargés au démarrage du serveur
- Injectés comme contexte système dans les prompts
- Améliore la pertinence et l'exactitude des réponses

**Fichiers** :
- `maine-coon.md` : Base principale sur les chats Maine Coon
- `rag/` : Bases thématiques additionnelles

---

#### 📁 `src/components/` - Composants (prévu)
**Objectif** : Composants réutilisables pour futures extensions

**Utilisation future** :
- Modal.js
- ChatBubble.js
- MessageList.js
- etc.

---

## Flux de travail

### Développement local
```bash
# Installation des dépendances
npm install

# Démarrage du serveur
npm start

# Accès à l'application
http://localhost:3000
```

### Structure des chemins

#### Depuis HTML (dans `public/`)
```html
<!-- CSS -->
<link rel="stylesheet" href="../src/css/style-chatbot.css">

<!-- JavaScript -->
<script src="../src/js/script-chatbot.js"></script>
```

#### Depuis server.js (dans `src/server/`)
```javascript
// Fichiers statiques
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Base de connaissance
const kbPath = path.join(__dirname, '..', 'knowledge', 'maine-coon.md');

// .env
const envPath = path.join(__dirname, '..', '..', '.env');
```

## Conventions de nommage

- **Dossiers** : lowercase avec tirets (ex: `public`, `src`, `node_modules`)
- **Fichiers CSS** : kebab-case (ex: `style-chatbot.css`)
- **Fichiers JS** : kebab-case (ex: `script-chatbot.js`)
- **Fichiers MD** : kebab-case (ex: `maine-coon.md`)
- **Variables env** : UPPER_SNAKE_CASE (ex: `OPENROUTER_API_KEY`)

## Taille du projet

```
Lignes de code (approximatif) :
- HTML : ~600 lignes (2 fichiers)
- CSS : ~250 lignes
- JavaScript (frontend) : ~500 lignes
- JavaScript (backend) : ~600 lignes
- Markdown (knowledge) : ~1500 lignes

Total : ~3450 lignes (hors node_modules)
```

## Maintenance

### Ajouter un nouveau style
1. Éditer `src/css/style-chatbot.css`
2. Rafraîchir le navigateur (pas de rebuild nécessaire)

### Ajouter une nouvelle fonctionnalité frontend
1. Éditer `src/js/script-chatbot.js`
2. Ou créer un nouveau fichier dans `src/js/`
3. L'importer dans HTML

### Ajouter un endpoint API
1. Éditer `src/server/server.js`
2. Redémarrer le serveur (`Ctrl+C` puis `npm start`)

### Ajouter une base de connaissance
1. Créer un fichier `.md` dans `src/knowledge/` ou `src/knowledge/rag/`
2. Modifier `server.js` pour le charger
3. Redémarrer le serveur

## Ressources

- **Documentation principale** : README.md
- **Architecture détaillée** : ARCHITECTURE.md
- **Historique des changements** : MIGRATION.md
- **Cette vue d'ensemble** : STRUCTURE.md
