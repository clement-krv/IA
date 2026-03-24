# Implementation Plan: Encodage et Hash du Texte

**Branch**: `001-text-encode-hash` | **Date**: 2026-03-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-text-encode-hash/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ajouter un pipeline de transformation optionnelle du texte avant génération du QR code, via un dropdown unique proposant 3 encodages, 3 hash et 1 mode sans transformation. L'application doit afficher la valeur finale sous le sélecteur et encoder exactement cette valeur dans le QR. L'implémentation reste 100% côté client (sans réseau, sans persistance), en conservant les contraintes de performance et de compatibilité de la constitution.

## Technical Context

**Language/Version**: HTML5 + JavaScript ES modules (ES2020+)  
**Primary Dependencies**: Bibliothèque locale Nayuki (`lib/qrcodegen.js`), Web Crypto API (`crypto.subtle`) pour hash, APIs natives (`TextEncoder`, `btoa`) pour encodage  
**Storage**: N/A (runtime only, aucune persistance)  
**Testing**: Playwright E2E (`npm run test:e2e`), Lighthouse CI (`npm run lhci`), tests manuels UI/scan  
**Target Platform**: Navigateurs modernes desktop/mobile (Chrome, Edge, Firefox, Safari) sur contexte sécurisé (localhost ou HTTPS pour hash)
**Project Type**: Web app statique (frontend only)  
**Performance Goals**: Génération QR < 100ms pour textes usuels, UI réactive (< 50ms perçus sur interaction), conserver score Lighthouse existant  
**Constraints**: Zéro appel réseau après chargement, zéro stockage persistant, QR universellement scannable, compatibilité mode sombre/clair  
**Scale/Scope**: 1 écran principal, ajout d'un module de transformation et extension du flux d'entrée existant (`app.js` + `index.html`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate Pré-Design

1. **Local Seclusion (Privacy-First)**: ✅ PASS  
  Transformations (encodage/hash) prévues localement en mémoire navigateur, sans API distante ni stockage.

2. **Universal Scannability (Compatibility)**: ✅ PASS  
  Le QR continue d'encoder une chaîne texte standard; la transformation ne modifie pas le moteur QR ni la Quiet Zone.

3. **Zero-Latency UI (Performance)**: ⚠️ PASS sous réserve  
  Les hash asynchrones peuvent ajouter un délai marginal; exigence de debounce et d'un flux de rendu non bloquant confirmée en Phase 0.

### Gate Post-Design

1. **Local Seclusion (Privacy-First)**: ✅ PASS  
  Design validé autour de `TextEncoder`, `btoa`, `crypto.subtle` uniquement.

2. **Universal Scannability (Compatibility)**: ✅ PASS  
  Sortie transformée explicitement affichée puis injectée telle quelle dans le générateur QR.

3. **Zero-Latency UI (Performance)**: ✅ PASS  
  Choix de 3 hash standards (`SHA-256`, `SHA-384`, `SHA-512`) en async non bloquant + mise à jour atomique du rendu.

## Project Structure

### Documentation (this feature)

```text
specs/001-text-encode-hash/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── transformation-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html           # UI: textarea, dropdown de transformation, affichage résultat
app.js               # Orchestration: input, transformation, rendu QR, état UI
qr-generator.js      # Génération SVG QR à partir du texte final
styles.css           # Styles layout + états dropdown/résultat
lib/qrcodegen.js     # Lib QR locale

share-handler.js     # Export/partage (inchangé fonctionnellement)
theme-manager.js     # Gestion thème (inchangé)
storage-manager.js   # Garde-fous anti-persistance (inchangé)
```

**Structure Decision**: Approche mono-projet frontend conservée. La feature est intégrée au flux existant `input -> transformation -> renderQr` sans backend ni nouveaux sous-projets.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
