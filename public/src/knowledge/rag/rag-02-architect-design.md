# Base de connaissance — Expert Architecture & Design

## 📄 À propos

Ce document sert de base de connaissance pour un système RAG / chatbot / assistant destiné à centraliser l'expertise d'un architecte / designer. Il contient des bonnes pratiques, des définitions, des processus, des FAQ, des références — utiles pour répondre aux questions, documenter des décisions ou servir de support interne.

---

## 📐 Principes & Fondamentaux de l'architecture / design

### Définition des concepts clés

- **Urbanisme** : étude de l'organisation des espaces bâtis, des infrastructures, des flux, de la cohérence territoriale.
- **Programme architectural** : ensemble des contraintes et besoins (fonctionnels, réglementaires, budget, spatialité) à respecter pour un projet.
- **Ergonomie & circulation** : disposition des espaces pour optimiser le confort, l'usage, la circulation des personnes.
- **Normes & réglementations** : respecter les normes locales (sécurité, accessibilité, énergie, environnement), le plan local d'urbanisme (PLU), le code de la construction, etc.
- **Durabilité & écoconception** : intégration de critères environnementaux (matériaux, isolation, orientation, performance énergétique, lumière naturelle, ventilation, gestion de l'eau…).

### Phases d'un projet architectural / design

1. **Analyse des besoins / programme** — recueil des besoins du client, contraintes site, réglementation, budget.
2. **Esquisse / conception préliminaire** — esquisses, plans shapés, organisation des volumes, orientations, fonctionnalités.
3. **Avant-projet (APS / APD)** — plans plus précis, coupes, surfaces, implantation, estimation coûts.
4. **Projet (PRO)** — plans définitifs, choix matériaux, détails techniques, structure.
5. **Consultation & permis / réglementation** — dossier pour permis de construire ou déclaration, conformité aux normes.
6. **Suivi chantier & mise en œuvre** — coordination, supervision, contrôle qualité, ajustements.
7. **Livraison & retours / post-projet** — vérification, bilan, retours d'expérience.

---

## 🛠️ Bonnes pratiques & recommandations

### Conception

- Toujours partir du **programme + contraintes** avant de dessiner : le design ne doit pas imposer des choix techniques irréalistes.
- Favoriser la **modularité** et la **flexibilité** : prévoir des espaces adaptables, modulables.
- Prendre en compte les aspects **humains** : lumière naturelle, confort visuel et acoustique, circulation fluide, ergonomie.
- Penser **durabilité & environnement** dès le départ : orientation, matériaux locaux / écoconçus, isolation, éléments passifs.

### Collaboration & communication cliente

- Gérer clairement les **briefs clients** : documenter les besoins, les envies, les contraintes.
- Produire des **livrables clairs** (plans, coupes, vues 3D, descriptions) pour faciliter la compréhension.
- Prévoir des **points de validation** à chaque étape majeure (esquisse, avant-projet, projet) avant de passer à la suivante.

---

## 🧩 FAQ — Questions fréquentes

**Q : Comment gérer un site avec contraintes (terrain pentu, norme, voisinage, exposition) ?**
**R** : Commencer par une analyse contextuelle — topographie, orientation, environnement, voisinage → adapter le programme et la volumétrie ; utiliser des esquisses pour tester plusieurs configurations ; privilégier l'intégration paysagère et l'optimisation des vues/lumière.

**Q : Quels critères pour choisir des matériaux durables / écoconçus ?**
**R** : Matériaux locaux ou à faible empreinte carbone, bonne isolation, durabilité, recyclabilité, faible impact sur la santé, compatibilité avec l'environnement + coût global (maintenance, usage).

**Q : Comment structurer un projet pour permettre des modifications futures / évolutivité ?**
**R** : Penser la structure et l'organisation des volumes de façon modulaire, anticiper des cloisonnements amovibles, prévoir des réserves techniques, garder une flexibilité dans l'usage des espaces.

---

## 📚 Références & Ressources utiles

- Documentation technique / réglementaire locale (normes, PLU, permis)
- Bibliographie / ouvrages d'architecture & design — principes, ergonomie, durabilité
- Études de cas projets antérieurs (plans, retours d'expérience, bilan)
- Contact collaborateurs / experts (ingénieur structure, matériau, urbanisme…)
- Gabarits de livrables & checklist projet

---

## 🧠 Comment cette base s'intègre dans un système RAG

- On structure l'information en **chunks** (sections, sous-sections) — ce qui facilite l'indexation et la récupération. :contentReference[oaicite:0]{index=0}*
- Lorsqu'un utilisateur — client, collègue, stagiaire — pose une question, le système RAG peut récupérer les passages les plus pertinents (ex. "phase du projet", "choix matériaux durables", "normes", "modularité") puis les utiliser comme contexte pour que le modèle de langage génère une réponse informée. :contentReference[oaicite:1]{index=1}*
- Cette approche évite les hallucinations : le chatbot s'appuie sur des données factuelles, spécifiques à votre expertise/organisation, plutôt que sur des généralités. :contentReference[oaicite:2]{index=2}*

\* Les références [oaicite:n] sont des exemples fictifs pour illustrer l'intégration dans un système RAG.
