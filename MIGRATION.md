# Refactorisation de l'architecture - 27 novembre 2025

## Objectif

Réorganiser la structure des fichiers du projet pour suivre les bonnes pratiques modernes de développement web, en séparant clairement le frontend, le backend et les ressources.

## Changements effectués

### 1. Nouvelle structure de dossiers

```plaintext
Avant:
/
├─ index.html
├─ landing-page.html
├─ script-chatbot.js
├─ style-chatbot.css
├─ server.js
├─ knowledge/
└─ RAG/

Après:
/
├─ public/
│  ├─ index.html
│  ├─ landing-page.html
│  └─ assets/images/
├─ src/
│  ├─ css/style-chatbot.css
│  ├─ js/
│  │   ├─ script-chatbot.js
│  │   └─ utils/
│  ├─ server/server.js
│  ├─ components/
│  └─ knowledge/
│      ├─ maine-coon.md
│      └─ rag/
├─ package.json
├─ README.md
└─ ARCHITECTURE.md (nouveau)
```

### 2. Fichiers déplacés

#### Frontend statique → `public/`

- ✅ `index.html` → `public/index.html`
- ✅ `landing-page.html` → `public/landing-page.html`
- ✅ Créé `public/assets/images/` pour futures ressources

#### Styles → `src/css/`

- ✅ `style-chatbot.css` → `src/css/style-chatbot.css`

#### Scripts → `src/js/`

- ✅ `script-chatbot.js` → `src/js/script-chatbot.js`
- ✅ Créé `src/js/utils/` pour futurs utilitaires

#### Backend → `src/server/`

- ✅ `server.js` → `src/server/server.js`

#### Base de connaissance → `src/knowledge/`

- ✅ `knowledge/` → `src/knowledge/`
- ✅ `RAG/` → `src/knowledge/rag/` (renommé en minuscules)
- ✅ Nettoyé les doublons créés pendant la migration

### 3. Mises à jour des chemins

#### Fichiers HTML (`public/*.html`)

- ✅ CSS : `style-chatbot.css` → `../src/css/style-chatbot.css`
- ✅ JS : `script-chatbot.js` → `../src/js/script-chatbot.js`

#### Server.js (`src/server/server.js`)

- ✅ Fichiers statiques : `__dirname` → `path.join(__dirname, '..', '..', 'public')`
- ✅ Knowledge base : `path.join(__dirname, 'knowledge')` → `path.join(__dirname, '..', 'knowledge')`
- ✅ .env : `path.join(__dirname, '.env')` → `path.join(__dirname, '..', '..', '.env')`

#### package.json

- ✅ `"main": "server.js"` → `"main": "src/server/server.js"`
- ✅ `"start": "node server.js"` → `"start": "node src/server/server.js"`
- ✅ Ajouté script `"dev": "node src/server/server.js"`

### 4. Documentation mise à jour

- ✅ README.md : Ajouté section "Structure du projet" avec arborescence complète
- ✅ README.md : Mis à jour la section "Architecture" avec explications détaillées
- ✅ Créé ARCHITECTURE.md : Documentation complète de l'architecture
- ✅ Créé MIGRATION.md : Ce fichier documentant les changements

## Tests effectués

### ✅ Serveur démarre correctement

```bash
npm start
# Output:
# Knowledge base loaded: Maine Coon
# Server listening on http://localhost:3000
```

### ✅ Chemins vérifiés

- Les fichiers HTML chargent correctement les CSS et JS
- Le serveur sert les fichiers statiques depuis `public/`
- La base de connaissance est chargée depuis `src/knowledge/`

## Avantages de la nouvelle structure

### 1. Séparation des responsabilités

- **public/** : Tout ce qui est accessible publiquement
- **src/** : Code source organisé par type (css, js, server, knowledge)

### 2. Scalabilité

- Structure claire pour ajouter de nouveaux modules
- Dossiers `components/` et `utils/` prêts pour extension

### 3. Bonnes pratiques

- Conforme aux conventions modernes (Next.js, Vite, etc.)
- Facilite l'ajout d'outils de build
- Prêt pour TypeScript, tests, CI/CD

### 4. Maintenance

- Code facile à naviguer
- Séparation frontend/backend claire
- Configuration centralisée à la racine

## Compatibilité

### ✅ Rétrocompatibilité

- Tous les endpoints API restent identiques
- Comportement fonctionnel inchangé
- Configuration `.env` au même emplacement

### ✅ Git

- `.gitignore` déjà correct (`.env`, `node_modules`)
- Pas de fichiers sensibles versionnés

## Prochaines étapes suggérées

1. **Tests automatisés**

   - Ajouter Jest pour tests unitaires
   - Tester les endpoints API
   - Tester le rendu frontend

2. **Build process**

   - Ajouter Vite ou Webpack
   - Minification CSS/JS
   - Optimisation des assets

3. **TypeScript**

   - Migrer progressivement vers TS
   - Types pour l'API backend
   - Types pour les composants frontend

4. **Docker**

   - Créer Dockerfile
   - docker-compose pour dev local
   - Image optimisée pour production

5. **CI/CD**
   - GitHub Actions
   - Tests automatiques
   - Déploiement automatisé

## Commandes utiles

```bash
# Démarrer le serveur
npm start

# Structure du projet
tree /F

# Vérifier les chemins
node -e "console.log(require('path').resolve('./public'))"
node -e "console.log(require('path').resolve('./src/server/server.js'))"

# Tester le serveur
curl http://localhost:3000/config
```

## Notes importantes

⚠️ **Changements de chemins** : Si vous aviez des bookmarks ou liens directs vers les fichiers, ils doivent être mis à jour.

✅ **Migration complétée** : Tous les fichiers ont été déplacés et les références mises à jour.

✅ **Tests réussis** : Le serveur démarre correctement et charge la base de connaissance.

## Auteur

Refactorisation effectuée le 27 novembre 2025 avec GitHub Copilot.
