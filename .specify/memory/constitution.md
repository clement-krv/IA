<!--
SYNC IMPACT REPORT
==================
Version: INITIAL → 1.0.0
Bump Rationale: Initial constitution ratification for QR-Text Local-First project

Principles Added:
- I. Local Seclusion (Privacy-First)
- II. Universal Scannability (Compatibility)
- III. Zero-Latency UI (Performance - NON-NEGOTIABLE)

Sections Added:
- Mission Statement
- Reference Personas
- Scope Boundaries

Templates Status:
✅ plan-template.md - Constitution Check section aligns with 3 core principles
✅ spec-template.md - User scenarios align with persona-driven approach
✅ tasks-template.md - Task categories support privacy, compatibility, and performance validation

Follow-up: None - all placeholders resolved
-->

# QR-Text Local-First Constitution

## Mission Statement

**Offrir le moyen le plus rapide, privé et universel de transférer du texte d'un écran vers un capteur photo sans passer par un réseau tiers.**

Cette mission guide chaque décision technique : toute fonctionnalité doit servir la rapidité, la vie privée ou l'universalité du transfert de texte via QR code.

## Core Principles

### I. Local Seclusion (Privacy-First)

**Règle non-négociable** : Aucune donnée utilisateur ne DOIT quitter le navigateur.

- Pas d'appels API vers des serveurs tiers
- Pas d'Analytics intrusif (aucun tracking utilisateur)
- Pas de cookies de suivi ou de stockage externe
- Tout traitement (génération QR, édition texte) s'exécute côté client uniquement
- Les logs système ne DOIVENT contenir aucune donnée sensible saisie par l'utilisateur

**Rationale** : La persona Marc (Sécurité) utilise l'application pour des secrets. Tout transfert réseau compromettrait la promesse de confidentialité et serait une violation critique du contrat utilisateur.

### II. Universal Scannability (Compatibility)

**Règle non-négociable** : Le QR code généré DOIT être lisible par n'importe quel appareil photo standard.

- Support iOS (versions courantes et -2 versions)
- Support Android (versions courantes et -3 versions)
- Compatibilité avec les appareils-photo vieillissants (résolution minimale 5MP)
- Niveaux de correction d'erreur adaptés (minimum Level M - 15% restauration)
- Contraste optimal en mode clair ET mode sombre
- Taille de QR code adaptative selon longueur du texte et résolution d'écran

**Rationale** : La mission exige l'universalité. Un QR code illisible sur un appareil vieux de 3 ans est un échec produit.

### III. Zero-Latency UI (Performance - NON-NEGOTIABLE)

**Règle non-négociable** : L'interface DOIT être prête à recevoir du texte en moins de 500ms après le chargement.

- Time-to-Interactive < 500ms sur connexion mobile 3G
- Pas de dépendances bloquantes au chargement initial
- Génération de QR code < 100ms pour textes ≤ 2000 caractères
- Rendu incrémental si texte > 2000 caractères
- Bouton "Clear All" avec réponse instantanée (< 16ms)
- Budget JavaScript initial < 50KB (minifié, gzippé)

**Validation** : Mesures Lighthouse Performance Score ≥ 95, Core Web Vitals "Good" sur tous les indicateurs.

**Rationale** : La persona Léa (Rapidité) abandonne l'application si elle attend plus de 2 secondes. La latence perçue tue l'utilité du produit. L'objectif "moins de 2 clics" implique zéro friction temporelle.

## Reference Personas

### Marc (Sécurité)

**Cas d'usage** : Transfert de secrets (mots de passe temporaires, clés API, tokens).

**Critère de succès** : Pas de logs, pas de traces, confirmation visuelle qu'aucune donnée ne quitte l'appareil.

**Implication technique** : Toute feature proposant du stockage persistant, de l'historique ou des API externes DOIT être rejetée.

### Léa (Rapidité)

**Cas d'usage** : Partage rapide d'URLs entre ordinateur et téléphone.

**Critère de succès** : Moins de 2 clics pour générer un QR code, scan instantané.

**Implication technique** : L'UI DOIT minimiser les étapes (pas de modal de configuration, pas de formulaires intermédiaires). L'éditeur plein écran s'ouvre directement.

## Scope Boundaries

### In-Scope (MUST implement)

- Éditeur de texte plein écran (focus automatique)
- Génération de QR Code (SVG ou Canvas selon navigateur)
- Mode Sombre automatique (détection `prefers-color-scheme`)
- Bouton "Clear All" avec confirmation visuelle
- Optimisation de taille QR selon longueur texte

### Out-of-Scope (MUST NOT implement)

- Stockage Cloud ou synchronisation entre appareils
- Historique persistant des textes générés
- Partage par email, SMS ou réseaux sociaux
- Authentification utilisateur ou comptes
- Analytics comportemental ou tracking utilisateur

**Rationale** : Le scope Out-of-Scope violerait directement le principe I (Local Seclusion). Toute demande d'expansion dans ces domaines DOIT être refusée car incompatible avec la constitution.

## Governance

### Amendment Process

- Les modifications à la constitution DOIVENT être documentées avec un Sync Impact Report
- Les changements de principes (ajout/suppression/redéfinition) requièrent une justification explicite
- Versionning sémantique obligatoire :
  - **MAJOR** : suppression ou redéfinition incompatible d'un principe
  - **MINOR** : ajout de nouveau principe ou section
  - **PATCH** : clarification, corrections typographiques

### Compliance

- Toute Pull Request DOIT être vérifiée contre les 3 principes fondamentaux
- Les revues de code DOIVENT rejeter les violations (ex: appel `fetch()` vers domaine externe)
- Les tests d'intégration DOIVENT valider :
  - Absence de requêtes réseau (principe I)
  - Compatibilité QR code multi-appareils (principe II)
  - Performance < 500ms Time-to-Interactive (principe III)

### Constitution Precedence

- En cas de conflit entre cette constitution et une demande feature, **la constitution prévaut**
- Les décisions techniques ambiguës DOIVENT être arbitrées en faveur du principe le plus strict applicable
- Le fichier `.specify/memory/constitution.md` est la source de vérité unique pour les règles du projet

**Version**: 1.0.0 | **Ratified**: 2026-02-24 | **Last Amended**: 2026-02-24
