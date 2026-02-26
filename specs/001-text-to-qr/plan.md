# Implementation Plan: QR-Text Local-First

**Branch**: `001-text-to-qr` | **Date**: 2026-02-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-text-to-qr/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Application web single-page permettant de transférer du texte d'un ordinateur vers un téléphone via QR code généré localement. L'interface présente un éditeur de texte dans une carte centrée avec génération de QR code en temps réel. Toute la logique (génération QR, thématisation, export d'images) s'exécute côté client sans aucun appel réseau. Approche technique : HTML5 + JavaScript vanilla (ou framework ultra-léger), bibliothèque QR code optimisée, Web Share API, Canvas/SVG pour le rendu. Budget de performance strict : < 500ms Time-to-Interactive, < 50KB bundle JavaScript, < 100ms génération QR.

## Technical Context

**Language/Version**: HTML5 + JavaScript (ES2020+, async/await, modules)  
**Primary Dependencies**: QR code library (qrcode.js or qrcodejs2 - to be evaluated in research phase), no heavy frameworks  
**Storage**: N/A (no persistent storage per FR-008 - constitution principle I)  
**Testing**: Playwright for E2E testing, Lighthouse CLI for performance validation, manual cross-device QR scanning tests  
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), mobile browsers (iOS Safari 14+, Chrome Android 90+)  
**Project Type**: Static Single Page Application (SPA) - deployable to any static hosting (GitHub Pages, Vercel, Netlify)  
**Performance Goals**: Time-to-Interactive < 500ms (3G), QR generation < 100ms (texts ≤ 2000 chars), Clear All response < 16ms (60fps), initial JS bundle < 50KB gzipped  
**Constraints**: Offline-capable after first load, zero network calls during usage, no persistent storage, works without JavaScript bundler (optional build step for minification only)  
**Scale/Scope**: Single-user client-side app, ~300-500 LOC (excluding QR library), 1 HTML file + 1 CSS file + 1 JS file (or minimal module split)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Local Seclusion (Privacy-First)

✅ **PASS** - Technical approach fully compliant:
- No backend/API required (static SPA)
- No analytics libraries planned
- No persistent storage (FR-008: "MUST NOT store text in cookies, localStorage, sessionStorage")
- QR generation via client-side JavaScript library only
- Save Image feature uses Blob/Data URL (FR-010: client-side only, no cloud upload)
- Web Share API is local-only (shares to device's native apps, not cloud)

**Risk**: None. Architecture is inherently compliant.

### Principle II: Universal Scannability (Compatibility)

✅ **PASS** - Design addresses all requirements:
- QR library selection will prioritize compatibility (ISO/IEC 18004 standard compliance)
- Error correction level M minimum (FR-013: 15% restoration)
- Adaptive QR size based on text length (FR-015)
- Quiet Zone requirement (FR-025: 4+ modules)
- Contrast ratio 4.5:1 minimum in light/dark modes (FR-014)
- Testing plan includes iOS 8+, Android Oreo+, and 5MP camera devices

**Risk**: QR library choice critical. Research phase must evaluate library compatibility.

### Principle III: Zero-Latency UI (Performance - NON-NEGOTIABLE)

⚠️ **REQUIRES VALIDATION** - Achievable but demanding:
- Time-to-Interactive < 500ms: **Depends on QR library size** (must be < 40KB to leave 10KB for app code)
- QR generation < 100ms: **Depends on library performance** (needs benchmarking in research phase)
- Bundle < 50KB: **Strict constraint** (HTML+CSS+JS+QR lib all included)
- Clear All < 16ms: **Easy** (simple DOM manipulation)

**Action Required (Phase 0 Research)**:
1. Benchmark QR libraries for generation speed (target: < 50ms for 2000 chars)
2. Measure library bundle sizes (gzipped)
3. Test Time-to-Interactive on throttled 3G connection
4. If no library meets criteria, consider Web Worker for async generation

**Fallback if violation occurs**: If QR generation exceeds 100ms for 2000 chars, implement progressive rendering (show partial QR + loading indicator). Must be justified in Complexity Tracking section.

### Summary

**Overall Status**: ✅ **CONDITIONALLY APPROVED**  
**Blockers**: None  
**Required Actions**: Phase 0 research must validate QR library performance and size constraints  
**Re-check After Phase 1**: Verify final architecture maintains zero network calls for Save/Share features

## Project Structure

### Documentation (this feature)

```text
specs/001-text-to-qr/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - N/A for this project (no external API)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
index.html           # Main HTML file (semantic structure, no inline styles/scripts)
styles.css           # Styling (light/dark themes, responsive layout)
app.js               # Main application logic
qr-generator.js      # QR code generation module (wraps library)
theme-manager.js     # Dark/light mode detection and manual toggle
storage-manager.js   # Ensures zero persistence (actively prevents storage)
share-handler.js     # Save Image + Web Share API logic

.github/
  workflows/
    lighthouse.yml   # CI: Lighthouse performance checks
    
README.md            # Project documentation
```

**Structure Decision**: 

Static single-page application with modular JavaScript files. No build tooling required for development (uses ES6 modules), optional minification step for production. This structure:
- Keeps bundle size minimal (no framework overhead)
- Enables offline-first capability (service worker can be added later if needed)
- Allows easy deployment to static hosting
- Maintains readability and testability

No `contracts/` directory needed as this project has no external APIs or programmatic interfaces. It's a self-contained web app with user-facing UI only.

## Complexity Tracking

**Status**: ✅ No complexity violations

This project adheres to simplicity principles:
- Zero backend (no server-side complexity)
- Zero framework overhead (vanilla JS or minimal library)
- Zero build tooling required (optional minification only)
- Zero persistent storage (no database, no state management)
- Zero network calls (no API integration)

The only external dependency is a QR code generation library, which is unavoidable for the core functionality. Research phase will select the smallest, fastest library that meets constitutional requirements.
