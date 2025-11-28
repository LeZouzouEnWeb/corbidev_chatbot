# Base de connaissance — Expert Full‑Stack HTML / CSS / JavaScript

## 📄 À propos

Ce document sert de base de connaissance pour un expert full‑stack spécialisé en HTML, CSS et JavaScript. Il peut être utilisé dans un système RAG pour fournir des réponses techniques, des bonnes pratiques, des snippets et des explications avancées.

---

## 🔧 Fondamentaux du stack

### HTML — Structure & sémantique

- Utiliser les balises sémantiques (`header`, `main`, `section`, `article`, `footer`).
- Toujours inclure des attributs d'accessibilité (`aria-label`, alt sur les images...).
- Préférer une hiérarchie de titres cohérente : un seul `h1` par page.
- Minimiser les div inutiles (éviter le "div soup").

### CSS — Mise en forme moderne

- Prioriser **Flexbox** et **CSS Grid** pour les layouts.
- Utiliser `:root` pour définir des variables CSS (couleurs, spacing…).
- Favoriser BEM ou un style de nommage clair.
- Gérer les thèmes (light/dark) via `data-theme` + variables CSS.
- Utiliser les nouvelles fonctionnalités : `:has`, `:is`, `clamp()`, `@container` queries…

### JavaScript — Fonctionnel & modulaire

- Favoriser ES Modules (`import / export`).
- Toujours cibler les éléments via `data-*` pour éviter le couplage fragile.
- Utiliser `async/await` pour les appels réseau.
- Éviter le DOM manipulation lourde : préférer templates, state interne ou frameworks.
- Stocker les états simples dans `localStorage` ou `sessionStorage` si nécessaire.
- Utiliser `fetch` au lieu d'XHR.

---

## 🧱 Architecture front-end recommandée

```text
index.html
src/
├── css/
│   ├── base.css
│   ├── components.css
│   └── utilities.css
├── js/
│   ├── main.js
│   ├── api/
│   │   └── http.js
│   ├── components/
│   │   └── modal.js
│   └── utils/
│       └── dom.js
```

### Principes

- Séparer **structure** (HTML), **style** (CSS), **logique** (JS).
- Mettre les composants isolés dans des fichiers individuels.
- Centraliser les fonctions utilitaires DOM.
- Éviter les scripts inline.

---

## 🎨 Bonnes pratiques UI/UX générales

- Toujours optimiser la lisibilité : contrastes, tailles de police, hiérarchie visuelle.
- Garder l'interface responsive par défaut (mobile-first).
- Utiliser des animations légères : `transform` + `opacity` (performant pour GPU).
- Éviter les animations lourdes (layout thrashing).
- Tester les interactions clavier (Tab, Enter, Escape).

---

## 🚀 Performance & optimisation

### HTML

- Charger les images dans les bons formats (`webp`, `avif`).
- Utiliser `loading="lazy"` sur les images.

### CSS

- Minimiser les recalculs : éviter les sélecteurs trop complexes.
- Favoriser les classes (plus rapides que les sélecteurs imbriqués).

### JavaScript

- Éviter les boucles lourdes dans le DOM.
- Debounce/Throttle lors des événements `scroll`, `resize`, `input`.
- Importer les modules JS dynamiquement (`import()` lazy loading).

---

## 🔌 API & gestion des données

### Exemple de wrapper HTTP

```js
export async function http(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("HTTP Error " + res.status);
  return res.json();
}
```

### Stockage local

```js
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");
```

---

## 🧩 Composants réutilisables (snippets)

### Modal simple en HTML/CSS/JS

```html
<div class="modal" data-modal>
  <div class="modal-content">
    <button data-close>Close</button>
    <slot></slot>
  </div>
</div>
```

```css
.modal {
  display: none;
  position: fixed;
  inset: 0;
  background: #0005;
}
.modal.active {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

```js
document.querySelector("[data-close]").addEventListener("click", () => {
  document.querySelector("[data-modal]").classList.remove("active");
});
```

---

## 🧪 Tests & maintenance

- Tester le DOM avec Playwright / Cypress.
- Vérifier la compatibilité navigateurs (Chrome, Firefox, Safari).
- Vérifier Lighthouse (Performance, A11y, SEO, Best Practices).

---

## 🏗️ Patterns avancés

### Progressive Enhancement

Commencer par un HTML fonctionnel, puis enrichir en JS uniquement ce qui est utile.

### Event delegation

```js
document.body.addEventListener("click", (e) => {
  if (e.target.matches('[data-action="delete"]')) {
    // action delete
  }
});
```

### State management simple sans framework

```js
const state = new Proxy(
  { count: 0 },
  {
    set(obj, prop, value) {
      obj[prop] = value;
      document.querySelector("[data-count]").textContent = value;
      return true;
    },
  }
);
```

---

## 📚 Ressources officielles

- MDN Web Docs
- Web.dev
- CSS Tricks
- You Don't Know JS
- W3C A11y Guidelines

---

## 🧠 Intégration dans un système RAG

- Structurer le contenu en sections claires (##, ###) pour faciliter l'indexation et la récupération des chunks pertinents.
- Lors d'une requête utilisateur, le système RAG peut identifier la section appropriée (par exemple "Performance", "Architecture front-end", "Bonnes pratiques UI/UX") et l'utiliser comme contexte pour générer une réponse précise et informée.
- Maintenir ce document à jour permet au chatbot de fournir des informations actuelles sans nécessiter de fine-tuning continu.

---

\* Les références [oaicite:n] sont des exemples fictifs pour illustrer l'intégration dans un système RAG.
