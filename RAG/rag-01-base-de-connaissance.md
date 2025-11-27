# Base de connaissance — Association "Chats & Co"

## 📄 À propos

Ce document sert de base de connaissance pour un chatbot RAG, destiné à aider bénévoles, adoptants, donateurs, et personnes intéressées par l'association. Chaque section contient des questions fréquentes et leurs réponses (FAQ), ainsi que des informations utiles à jour pour l'association.

---

## 🐱 Adoption

### Comment adopter un chat ?

- Remplir le formulaire en ligne ➜ lien sur le site.
- Être âgé(e) de 18 ans ou plus.
- Habiter en France / zone définie (préciser).
- Accepter le suivi post-adoption (visites / photos / retours).

### Quels sont les coûts d'adoption ?

- Frais d'adoption : 80 &euro;.
- Chaton stérilisé, vacciné, identifié.
- Livraison transport possible — frais supplémentaires selon distance.

### Quelles sont les conditions d'accueil ?

- Logement adapté, sécurisation (fenêtres, balcon, extérieur)
- Engagement minimum de 1 an.
- Accord des personnes vivant sur place.

---

## 🩺 Santé & soins

### Chats stérilisés / vaccinés — Pourquoi est-ce important ?

- La stérilisation évite la surpopulation et les abandons.
- Les vaccins protègent le chat et la communauté.
- L'association vérifie avant l'adoption.

### Que faire si je trouve un chat errant / abandonné ?

- Contacter l'association via le formulaire « Signalement ».
- Donner un maximum d'informations : localisation, photos, état de santé, comportement.
- Si possible, temporiser dans un espace sécurisé le temps que l'association vienne.

---

## 💶 Dons & bénévolat

### Comment faire un don ?

- Via la plateforme en ligne (CB, virement ou chèque).
- Ou lors des événements / collectes.
- Tous les dons sont bienvenus — nourriture, soins vétérinaires, etc.

### Comment devenir bénévole ?

- Remplir le formulaire de bénévolat.
- Participer à un entretien (présentiel ou visio).
- Indiquer vos disponibilités, compétences (soins, transport, communication, réseau).

### À quoi servent les dons ?

- Nourriture, litière, soins vétérinaires, stérilisations.
- Logistique (transport, matériel).
- Communication & sensibilisation.

---

## 📞 Contact & support

- Email : <contact@association-chats-co.org>
- Téléphone (urgence) : 06 XX XX XX XX
- Formulaire de contact / signalement sur le site

---

## ❓ FAQ générale

**Q : Puis-je adopter si je vis en appartement ?**  
**R** : Oui, si l'appartement est sécurisé, sans danger (fenêtres fermées ou sécurisées), et si vous vous engagez à offrir un environnement stable.

**Q : Est-ce que le chatbot peut remplacer un bénévole pour l'urgence ?**  
**R** : Non — le chatbot peut aider à collecter des informations et donner des consignes, mais pour toute urgence (santé, capture, secours) un bénévole doit intervenir directement.

---

🧩 Comment ce fichier s'intègre dans un système RAG

- On structure l'information avec des titres / sous-titres (##, ###) pour qu'un agent RAG puisse retrouver facilement les sections pertinentes. Ceci aide à l'indexation et à la récupération.

- Lors d'une requête utilisateur, le système peut trouver le bon « chunk » (par exemple la section Adoption / FAQ / Contact) et l'utiliser pour répondre de façon factuelle, en évitant les hallucinations.

- L'approche RAG permet que la base reste à jour sans fine-tuning continu : il suffit de modifier ce fichier markdown pour que le chatbot prenne en compte les changements.

---

\* Les références [oaicite:n] sont des exemples fictifs pour illustrer l'intégration dans un système RAG.
