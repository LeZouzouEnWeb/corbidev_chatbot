# Base de connaissance — Mutualisée (Association, Architecture/Design, UI/UX, Full‑Stack)

## 📄 À propos

Cette base mutualise 4 corpus RAG pour un assistant unique:

- Association "Chats & Co" (processus, FAQ, dons, santé)
- Architecture & Design (principes, phases, bonnes pratiques)
- UI/UX avec Tailwind CSS + chadcn‑ui (stack, accessibilité, patterns)
- Expert Full‑Stack HTML/CSS/JS (architecture front, performance, snippets)

Utiliser les sections et sous‑sections pour indexer et récupérer des chunks pertinents.

---

## 🔎 Sommaire

- [Association Chats Co](#association-chats-co)
- [Architecture Design](#architecture-design)
- [UI/UX Tailwind chadcn ui](#uiux-tailwind-chadcn-ui)
- [Expert Full‑Stack HTML/CSS/JS](#expert-fullstack-htmlcssjs)
- [Integration RAG Conseils](#integration-rag-conseils)
- [Ressources](#ressources)

---

## Association Chats Co

### Adoption

- Formulaire en ligne, 18+, zone géographique précisée, suivi post‑adoption.
- Frais: 80 &euro;euro;; chaton stérilisé, vacciné, identifié; transport possible selon distance.
- Conditions: logement sécurisé (fenêtres/balcon), engagement ≥ 1 an, accord du foyer.

### Santé & soins

- Stérilisation: évite surpopulation/abandon. Vaccins: protègent individu et communauté.
- Chat errant: formulaire « Signalement » + infos (localisation, photos, état), sécuriser temporairement si possible.

### Dons & bénévolat

- Dons: plateforme (CB/virement/chèque), événements; utilisés pour nourriture, soins, logistique, communication.
- Bénévolat: formulaire, entretien, disponibilités/compétences (soins, transport, com, réseau).

### Contact

- Email: <contact@association-chats-co.org>
- Téléphone (urgence): 06 XX XX XX XX
- Formulaire site.

### FAQ Association

- Appartement: oui si sécurisé et environnement stable.
- Chatbot ≠ bénévole: aide à l'info, pas pour urgences.

---

## Architecture Design

### Concepts clés

- Urbanisme: organisation des espaces/flux/infrastructures.
- Programme architectural: besoins/contraintes (fonctionnels, réglementaires, budget, spatialité).
- Ergonomie & circulation: confort d'usage, dispositions optimisées.
- Normes & réglementations: sécurité, accessibilité, énergie, environnement, PLU, code construction.
- Durabilité & écoconception: matériaux, isolation, orientation, performance énergétique, lumière, ventilation, eau.

### Phases projet

1. Analyse des besoins/programme.
2. Esquisse (volumes, orientations, fonctionnalités).
3. Avant‑projet APS/APD (plans précis, surfaces, coûts).
4. Projet PRO (définitif, détails techniques, matériaux, structure).
5. Consultation & permis (dossiers, conformité).
6. Suivi chantier & mise en œuvre (coordination, qualité, ajustements).
7. Livraison & retours (bilan, REX).

### Bonnes pratiques

- Conception: partir du programme/contraintes; modularité/flexibilité; facteurs humains; durabilité dès l'amont.
- Collaboration: briefs structurés; livrables clairs; validations à chaque étape.

### FAQ Architecture

- Site contraint: analyse contextuelle (topo, orientation, voisinage), adapter programme/volumétrie, intégration paysagère, optimiser vues/lumière.
- Matériaux durables: locaux/faible carbone, isolation, durabilité/recyclabilité, santé, compatibilité, coût global.
- Évolutivité: structure modulaire, cloisons amovibles, réserves techniques, flexibilité d'usage.

---

## UI/UX Tailwind chadcn ui

### Pourquoi ce stack

- chadcn‑ui: composants accessibles stylés avec Tailwind; distribution copy‑paste → propriété du code.
- Tailwind utility‑first: ajustements rapides, personnalisation fine, contrôle total.
- Primitives Radix UI: accessibilité/ARIA, interactions standardisées.

### Structure recommandée

```plaintext
src/
├─ components/ui/
├─ styles/
│  └─ tokens.css
├─ pages/ ou app/
├─ index.css
└─ tailwind.config.js
```

### Bonnes pratiques (UI/UX)

- Design tokens/variables CSS pour cohérence globale.
- Standardiser via composants chadcn‑ui; utiliser primitives Tailwind+Radix pour besoins très custom.
- Performance: éviter CSS global volumineux, privilégier utilitaires Tailwind; code local facilite debug/personnalisation/versionning.
- Accessibilité: tester focus/hover/active, thèmes light/dark, responsive.

### FAQ UI/UX

- Sans React: non, chadcn‑ui vise React et compatibles.
- Personnalisation: oui via classes Tailwind/variables CSS.
- Inconvénients: nécessite projet JS/React + build Tailwind; risque verbosité si mal intégré.
- Petits projets: Tailwind seul peut suffire; chadcn‑ui brille pour UI riches/modulables.

---

## Expert Full‑Stack HTML/CSS/JS

### HTML

- Balises sémantiques; attributs a11y; un seul `h1`; éviter "div soup".

### CSS

- Layouts: Flexbox/Grid; variables `:root`; nommage clair (BEM ou équivalent); thèmes via `data-theme` + variables; utiliser `:has`, `:is`, `clamp()`, `@container`.

### JavaScript

- ES Modules; cibler via `data-*`; `async/await` + `fetch`; limiter manipulations DOM; états simples via `localStorage`/`sessionStorage`.

### Architecture front recommandée

```plaintext
src/
├─ css/
│  ├─ base.css
│  ├─ components.css
│  └─ utilities.css
├─ js/
│  ├─ main.js
│  ├─ api/http.js
│  ├─ components/modal.js
│  └─ utils/dom.js
```

### UI/UX générales

- Lisibilité (contrastes, tailles, hiérarchie); responsive mobile‑first; animations légères (`transform`+`opacity`); éviter thrashing; tester interactions clavier.

### Performance

- HTML: images `webp/avif`, `loading="lazy"`.
- CSS: sélecteurs simples, privilégier classes.
- JS: éviter boucles DOM lourdes; debounce/throttle sur `scroll`/`resize`/`input`; `import()` pour lazy loading.

### API & données

```js
export async function http(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("HTTP Error " + res.status);
  return res.json();
}
```

```js
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");
```

### Snippets composants

- Modal simple (HTML/CSS/JS) avec bouton close et classe `active`.

### Tests & maintenance

- Playwright/Cypress; compatibilité navigateurs; Lighthouse.

### Patterns avancés

- Progressive Enhancement; Event delegation; State management minimal via `Proxy`.

---

## Integration RAG Conseils

- Structurer en sections/sous‑sections pour des chunks clairs.
- Indexer avec titres explicites et mots‑clés.
- Mettre à jour en continu; chaque modification reflète dans les réponses.
- Éviter citations opaques; préférer extraits concis, factuels.
- Pour UI/UX, conserver mentions d'accessibilité et tokens.
- Pour architecture, garder phases et définitions clés.
- Pour association, prioriser FAQ et contacts.

---

## Ressources

- chadcn‑ui: registry, guides d'installation.
- Radix UI: primitives accessibles.
- MDN, Web.dev, CSS‑Tricks, W3C A11y.
- Docs locales (PLU, code construction), bibliographie architecture.
- Liens internes Association (formulaires, contact, dons).
