# Base de connaissance mutualisée (RAG)

Ce document regroupe **toutes les expertises mentionnées dans nos conversations** : IA, chatbots, architecture, UI/UX, Tailwind, chadcn, fullstack HTML/CSS/JS.

---

# 1. Chatbots IA pour associations & entreprises (2025)

## 1.1. Contexte et tendances 2025
- Adoption massive des IA dans les organisations à but non lucratif.
- Automatisation des tâches répétitives (FAQ, tri demandes, gestion donateurs).
- Intégration avec CRM (HubSpot, Salesforce NPSP, Odoo Associatif).
- Paiement/dons assistés automatiquement.
- Agents IA spécialisés (adoption chats, éducation, évènements).

## 1.2. Cas d’usage pour associations animalières (ex : refuges, chats)
- Chatbot adoption : questionnaire, matching, vérification environnement, prise de RDV.
- Support bénévoles : onboarding, planning, FAQ interne.
- Gestion dons & campagnes : relance donateurs, suivi paiements.
- Assistance site web : orientation des visiteurs, explication procédures.

## 1.3. Modèles commerciaux
- SaaS mensuel (10–199 €/mois selon volume).
- Intégration + maintenance.
- Chatbot spécialisé sectoriel (animaleries, refuges = niche très rentable).
- Marketplace de scénarios / modules.

---

# 2. RAG pour expert architecture design

## 2.1. Principes fondamentaux
- Cohérence visuelle (Design System).
- Accessibilité (WCAG 2.2 AA).
- Architectures UI : Atomic Design, Modular Design, Tokens.
- Documentation centralisée.

## 2.2. Design System
- Tokens : couleurs, polices, espaces, radius.
- Patterns : boutons, cartes, formulaires, modales.
- Guidelines : responsive, interactivité, motion.

## 2.3. Architecture Front-end
- Separation of concerns : UI / State / Services.
- Approche component-driven.
- Revue UX régulière.

---

# 3. RAG — UI/UX avec Tailwind CSS + chadcn

## 3.1. Pourquoi ce stack ?
- Composants accessibles (Radix UI).
- Code possédé (copie dans projet).
- Ultra personnalisable via Tailwind.
- Idéal pour Design System scalable.

## 3.2. Structure projet recommandée
```
src/
├── components/ui/        # composants chadcn
├── components/custom/    # tes composants custom
├── styles/
│     └── tokens.css      # design tokens
├── app/ ou pages/
├── lib/
└── index.css
```

## 3.3. Bonnes pratiques
- Accessibilité d’abord (ARIA, roles, focus).
- Tokens globaux (couleurs, shadow, radius).
- Dark mode par classes ou data-theme.
- Animations légères (framer motion si besoin).

## 3.4. UI patterns à documenter
- Layout responsive (grid, flex).
- Navigation : sidebar, topbar, mobile menu.
- Formulaires complets : validation + erreurs.
- Composants interactifs (drawer, modal, toast).

---

# 4. RAG — Expert Fullstack HTML / CSS / JS

## 4.1. HTML (expert)
- Sémantique parfaite (header, main, section, article).
- ARIA roles & attributs.
- SEO : meta tags, structure H1–H6, Open Graph.
- Formulaires : inputs, validation native.

## 4.2. CSS (expert)
- Flexbox / Grid avancé.
- Animations CSS (keyframes, transitions).
- Variables CSS (custom properties).
- Architecture CSS : BEM, OOCSS, ITCSS.
- Optimisation performance : minify, inline critical CSS.

## 4.3. JavaScript (expert)
- Modules ES6.
- Fetch / API REST / async-await.
- Gestion du DOM performante.
- Structures : MVC, composantisation sans framework.
- Sécurité JS : XSS, CORS, CSP.

## 4.4. Performance web
- Lazy loading images.
- Tree shaking.
- Minification & bundlers.
- Caching & CDN.

---

# 5. RAG consolidé : comment l’utiliser

## 5.1. Structure pour indexation RAG
- Chaque section contient des blocs courts indexables.
- Le système peut répondre à :
  - IA & chatbots 2025.
  - Architecture design.
  - UI/UX avancé (Tailwind + chadcn).
  - Fullstack HTML/CSS/JS.

## 5.2. Exemple de question que ce RAG couvre
- "Comment créer un composant accessible avec chadcn ?"
- "Quel business model pour un chatbot IA pour refuge ?"
- "Comment structurer un design system ?"
- "Méthodes pour optimiser un site HTML/CSS/JS ?"

## 5.3. Extension possible
- Ajouter code examples.
- Ajouter schémas architecture.
- Ajouter templates réutilisables.
- Ajouter playbooks IA / UX.

---

# FIN — version mutualisée complète
