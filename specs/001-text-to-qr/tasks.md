---
description: "Task list for QR-Text Local-First implementation"
---

# Tasks: QR-Text Local-First

**Input**: Design documents from `/specs/001-text-to-qr/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- Root-level files: `index.html`, `styles.css`, `app.js`, etc.
- Library folder: `lib/qrcodegen.js`

---

## Phase 0: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic file structure

- [ ] T001 [P] [SETUP] Create `index.html` with semantic HTML5 structure (viewport meta, no inline scripts/styles)
- [ ] T002 [P] [SETUP] Create `styles.css` with CSS variables for theming (light/dark modes, colors, spacing)
- [ ] T003 [P] [SETUP] Download Nayuki QR Code generator library to `lib/qrcodegen.js` (minified version)
- [ ] T004 [P] [SETUP] Create `package.json` for build scripts (optional minification, Lighthouse CI, Playwright)
- [ ] T005 [P] [SETUP] Create `.github/workflows/lighthouse.yml` for CI performance testing

**Checkpoint**: After T001-T005, you should be able to serve `index.html` and see a blank page.

---

## Phase 1: User Story 1 - Génération instantanée de QR code (Priority: P1)

**Goal**: Core MVP - text input with real-time QR code generation

**Independent Test**: Open app → type text → QR code appears → scan with phone → text matches

### Implementation Tasks

- [ ] T101 [US1] Create `app.js` with module structure (imports, state initialization, main function)
- [ ] T102 [US1] Add textarea element to `index.html` with auto-focus attribute
- [ ] T103 [US1] Add QR code container (div or svg) to `index.html` below textarea
- [ ] T104 [US1] Create `qr-generator.js` module with `generateQR(text, options)` function wrapping Nayuki library
- [ ] T105 [US1] Implement SVG rendering in `qr-generator.js` (use Nayuki's `toSvgString()` method)
- [ ] T106 [US1] Add Quiet Zone (4 modules) to SVG via `viewBox` offset calculation in `qr-generator.js`
- [ ] T107 [US1] Connect textarea `input` event to QR generation in `app.js` (debounce 50ms)
- [ ] T108 [US1] Style textarea in `styles.css` (prominent card layout, centered, responsive)
- [ ] T109 [US1] Style QR code container in `styles.css` (white background, shadow, centered below textarea)
- [ ] T110 [US1] Test Time-to-Interactive < 500ms using Lighthouse (run `lhci autorun`)

**Checkpoint**: After T101-T110, you should have a working text → QR code generator.

---

## Phase 2: User Story 2 - Édition de texte avec compteur (Priority: P2)

**Goal**: Character counter + progress bar + soft/hard limits

**Independent Test**: Paste long text → counter shows "X / 2000" → progress bar fills → warnings appear at 2000 and 5000

### Implementation Tasks

- [ ] T201 [P] [US2] Add character counter element to `index.html` (e.g., `<span id="counter">0 / 2000</span>`)
- [ ] T202 [P] [US2] Add progress bar element to `index.html` (HTML5 `<progress>` or styled div)
- [ ] T203 [US2] Add warning message container to `index.html` (hidden by default)
- [ ] T204 [US2] Implement `updateCounter(length)` function in `app.js` to update counter text
- [ ] T205 [US2] Implement `updateProgressBar(percent)` function in `app.js` to update progress bar width/value
- [ ] T206 [US2] Implement `getWarningLevel(length)` function in `app.js` returning 'none' | 'soft' | 'hard'
- [ ] T207 [US2] Show yellow warning when length > 2000 ("Scannability may degrade with long text")
- [ ] T208 [US2] Show red warning when length > 5000 ("Hard limit reached. Consider reducing text.")
- [ ] T209 [US2] Style counter in `styles.css` (positioned near textarea, monospace font)
- [ ] T210 [US2] Style progress bar in `styles.css` (linear gradient: green → yellow → red)
- [ ] T211 [US2] Style warning messages in `styles.css` (yellow/red backgrounds, appropriate contrast)

**Checkpoint**: After T201-T211, character counter and progress bar should update in real-time.

---

## Phase 3: User Story 3 - Sauvegarde et partage local (Priority: P3)

**Goal**: Export QR code as PNG + Web Share API integration

**Independent Test**: Generate QR → click Save → PNG downloads → click Share (mobile) → native share menu appears

### Implementation Tasks

- [ ] T301 [P] [US3] Add "Save Image" button to `index.html` below QR code
- [ ] T302 [P] [US3] Add "Share" button to `index.html` next to Save button
- [ ] T303 [US3] Create `share-handler.js` module with `saveImage(svgElement)` function
- [ ] T304 [US3] Implement PNG generation from SVG in `share-handler.js` (use Canvas API + `toBlob()`)
- [ ] T305 [US3] Implement download trigger using `<a download="qr-code.png">` trick or Blob URL
- [ ] T306 [US3] Implement Web Share API check in `share-handler.js` (`navigator.share && navigator.canShare()`)
- [ ] T307 [US3] Call `navigator.share({ files: [pngFile] })` when Share button clicked
- [ ] T308 [US3] Disable/hide Share button if Web Share API not supported (add tooltip "Not supported")
- [ ] T309 [US3] Style Save/Share buttons in `styles.css` (primary action buttons, hover states)
- [ ] T310 [US3] Ensure minimum PNG size is 512x512 pixels (resize if needed in `share-handler.js`)
- [ ] T311 [US3] Verify zero network calls in DevTools when Save/Share clicked (SC-018 validation)

**Checkpoint**: After T301-T311, Save and Share buttons should work without network calls.

---

## Phase 4: User Story 4 - Mode sombre et paramètres (Priority: P4)

**Goal**: Auto dark mode + manual theme override + QR error correction settings

**Independent Test**: Open in dark mode OS → app is dark → click gear → change theme → updates instantly

### Implementation Tasks

- [ ] T401 [P] [US4] Add CSS media query `@media (prefers-color-scheme: dark)` in `styles.css`
- [ ] T402 [P] [US4] Define CSS variables for light theme (--bg-color, --text-color, --card-bg, etc.)
- [ ] T403 [P] [US4] Define CSS variables for dark theme inside media query
- [ ] T404 [US4] Add settings button (gear icon ⚙️) to `index.html` (positioned top-right corner)
- [ ] T405 [US4] Add settings modal/dropdown to `index.html` (hidden by default)
- [ ] T406 [US4] Add theme selector to settings: Radio buttons for Light/Dark/System
- [ ] T407 [US4] Add QR error correction selector: Radio buttons for L/M/Q/H
- [ ] T408 [US4] Create `theme-manager.js` module with `setTheme(mode)` function
- [ ] T409 [US4] Implement `data-theme` attribute toggle on `<html>` element in `theme-manager.js`
- [ ] T410 [US4] Connect theme selector change event to `setTheme()` in `app.js`
- [ ] T411 [US4] Update `qr-generator.js` to accept `errorCorrectionLevel` parameter
- [ ] T412 [US4] Connect error correction selector to QR regeneration in `app.js`
- [ ] T413 [US4] Style settings modal in `styles.css` (popup overlay, radio buttons, labels)
- [ ] T414 [US4] Ensure QR Quiet Zone maintains 4+ module white border in dark mode (test visually)

**Checkpoint**: After T401-T414, theme and error correction should be adjustable via settings.

---

## Phase 5: User Story 5 - Effacement sécurisé (Priority: P5)

**Goal**: Clear All button that wipes text, QR, and memory instantly

**Independent Test**: Enter text → click Clear All → everything disappears → reload page → no text restored

### Implementation Tasks

- [ ] T501 [P] [US5] Add "Clear All" button to `index.html` (positioned prominently, distinct color)
- [ ] T502 [US5] Implement `clearAll()` function in `app.js` that resets all state
- [ ] T503 [US5] Clear textarea value (`textarea.value = ''`)
- [ ] T504 [US5] Clear QR code container (`qrContainer.innerHTML = ''`)
- [ ] T505 [US5] Reset character counter to "0 / 2000"
- [ ] T506 [US5] Reset progress bar to 0%
- [ ] T507 [US5] Hide all warning messages
- [ ] T508 [US5] Verify no text in memory (add console assertion in dev mode: `console.assert(appState.textInput.value === '')`)
- [ ] T509 [US5] Ensure response time < 16ms (measure with `performance.now()` in dev mode)
- [ ] T510 [US5] Style Clear All button in `styles.css` (destructive action, red/orange, hover state)

**Checkpoint**: After T501-T510, Clear All should instantly wipe everything.

---

## Phase 6: Anti-Persistence & Constitutional Compliance

**Goal**: Actively prevent storage violations and validate constitutional requirements

### Implementation Tasks

- [ ] T601 [P] [CONST] Create `storage-manager.js` with `preventPersistence()` function
- [ ] T602 [P] [CONST] Add localStorage/sessionStorage override to throw errors in dev mode (proxy pattern)
- [ ] T603 [P] [CONST] Add `<meta http-equiv="Cache-Control" content="no-store">` to `index.html`
- [ ] T604 [CONST] Call `preventPersistence()` at app startup in `app.js`
- [ ] T605 [CONST] Verify zero network calls: Open DevTools Network tab → load app → type text → should show 0 requests
- [ ] T606 [CONST] Verify zero storage: Open DevTools Application → Storage → all should be empty after using app
- [ ] T607 [CONST] Verify QR generation < 100ms: Add `console.time('qr-gen')` before and `console.timeEnd('qr-gen')` after QR generation
- [ ] T608 [CONST] Verify bundle size < 50KB: Run `du -sh index.html styles.css app.js lib/*.js` and check gzipped size
- [ ] T609 [CONST] Scan QR codes on real devices: iPhone (iOS 14+), Android (Oreo+), verify 95%+ success rate
- [ ] T610 [CONST] Test with 5MP camera device (older phone) to verify Universal Scannability

**Checkpoint**: After T601-T610, all constitutional requirements should be validated.

---

## Phase 7: Polish & Edge Cases

**Goal**: Handle edge cases and improve UX

### Implementation Tasks

- [ ] T701 [P] [POLISH] Handle empty text: Hide QR code when textarea is empty (no placeholder QR)
- [ ] T702 [P] [POLISH] Handle Unicode/emojis: Test with "Hello 👋 世界!" and verify QR encodes correctly
- [ ] T703 [P] [POLISH] Add browser compatibility check: Show warning on IE11 or very old browsers
- [ ] T704 [P] [POLISH] Add responsive layout: Ensure app works on small screens (min 320px width)
- [ ] T705 [P] [POLISH] Add loading indicator: Show brief spinner if QR generation takes > 50ms (for very long texts)
- [ ] T706 [P] [POLISH] Add keyboard shortcuts: Ctrl+K or Cmd+K to clear all, Ctrl+S or Cmd+S to save
- [ ] T707 [P] [POLISH] Add accessibility: ARIA labels on buttons, semantic HTML, keyboard navigation
- [ ] T708 [P] [POLISH] Add visual feedback: Briefly highlight Save button after successful download ("✓ Saved!")
- [ ] T709 [P] [POLISH] Test offline mode: Open app → toggle DevTools Offline → reload → should still work
- [ ] T710 [P] [POLISH] Add copy-to-clipboard fallback for Share on desktop (if share not supported)

**Checkpoint**: After T701-T710, edge cases should be handled gracefully.

---

## Phase 8: Testing & Documentation

**Goal**: Automated tests + final documentation

### Implementation Tasks

- [ ] T801 [P] [TEST] Create `playwright.config.js` with E2E test configuration
- [ ] T802 [P] [TEST] Write Playwright test: "should generate QR code from text input" in `tests/e2e/qr-generation.spec.js`
- [ ] T803 [P] [TEST] Write Playwright test: "should update character counter in real-time" in `tests/e2e/counter.spec.js`
- [ ] T804 [P] [TEST] Write Playwright test: "should save QR code as PNG without network calls" in `tests/e2e/save-image.spec.js`
- [ ] T805 [P] [TEST] Write Playwright test: "should clear all data when Clear All clicked" in `tests/e2e/clear-all.spec.js`
- [ ] T806 [P] [TEST] Write Playwright test: "should respect dark mode preference" in `tests/e2e/dark-mode.spec.js`
- [ ] T807 [P] [TEST] Configure Lighthouse CI in `.github/workflows/lighthouse.yml` to run on every PR
- [ ] T808 [P] [TEST] Set Lighthouse assertions: Performance Score >= 95, TTI < 500ms
- [ ] T809 [P] [DOC] Write `README.md` with project overview, features, and deployment instructions
- [ ] T810 [P] [DOC] Add screenshots to `README.md` (light mode, dark mode, QR code example)

**Checkpoint**: After T801-T810, CI/CD and documentation should be complete.

---

## Phase 9: Final Validation & Deployment

**Goal**: Pre-launch checklist and production deployment

### Final Checks

- [ ] T901 [FINAL] Run full test suite: `npx playwright test` → All tests pass
- [ ] T902 [FINAL] Run Lighthouse CI: `lhci autorun` → Performance Score >= 95
- [ ] T903 [FINAL] Verify bundle size: `npm run build && du -sh dist/` → < 50KB gzipped
- [ ] T904 [FINAL] Manual testing on 3 browsers: Chrome, Firefox, Safari → No errors
- [ ] T905 [FINAL] Manual testing on 3 devices: Desktop, iOS mobile, Android mobile → All features work
- [ ] T906 [FINAL] Scan test QR codes: 10 different texts (short URL, long text, emoji mix) → 100% scannable
- [ ] T907 [FINAL] Review constitution compliance: Re-read `.specify/memory/constitution.md` → Confirm zero violations
- [ ] T908 [FINAL] Deploy to staging: Push to `staging` branch → Deploy to Vercel/Netlify preview
- [ ] T909 [FINAL] Smoke test staging: Open staging URL → Test full workflow → Verify production behavior
- [ ] T910 [FINAL] Deploy to production: Merge to `main` → Deploy to production hosting → Announce launch 🎉

**Checkpoint**: After T901-T910, app is production-ready!

---

## Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 0: Setup | T001-T005 | Project initialization |
| 1: US1 (P1) | T101-T110 | Core QR generation |
| 2: US2 (P2) | T201-T211 | Character counter + limits |
| 3: US3 (P3) | T301-T311 | Save/Share features |
| 4: US4 (P4) | T401-T414 | Dark mode + settings |
| 5: US5 (P5) | T501-T510 | Clear All button |
| 6: Constitution | T601-T610 | Compliance validation |
| 7: Polish | T701-T710 | Edge cases + UX improvements |
| 8: Testing | T801-T810 | Automated tests + docs |
| 9: Final | T901-T910 | Pre-launch validation |

**Total Tasks**: 91  
**Estimated Effort**: 3-5 developer-days (for solo developer)  
**Critical Path**: Phase 1 (US1) must complete before others can fully function

---

## Notes

### Parallelization Opportunities

Tasks marked with **[P]** can run in parallel if you have multiple developers:
- Phase 0 setup tasks (T001-T005)
- CSS styling tasks (T108-T109, T209-T211, T309, T413, T510)
- Module creation tasks (T104, T303, T408, T601)

### Dependencies

- **Phase 2-5** all depend on Phase 1 (T101-T110) completing first
- **Phase 6** (constitution) tests the combined system, runs after Phase 5
- **Phase 8** (testing) can start early but final tests require all phases done

### Performance Budget Tracking

After each phase, verify:
1. Is bundle size still < 50KB?
2. Is Time-to-Interactive still < 500ms?
3. Is QR generation still < 100ms?

If any metric regresses, pause and refactor before continuing.

---

**Ready to start? Begin with Phase 0: Setup! 🚀**
