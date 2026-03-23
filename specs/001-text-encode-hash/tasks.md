# Tasks: Encodage et Hash du Texte

**Input**: Design documents from /specs/001-text-encode-hash/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/transformation-ui-contract.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature scaffolding and shared constants

- [ ] T001 Create transformation mode constants in transformation-modes.js
- [ ] T002 [P] Add transformation UI placeholders in index.html
- [ ] T003 [P] Add base styling slots for dropdown and result block in styles.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core transformation pipeline required by all user stories

**CRITICAL**: No user story work starts before this phase is complete

- [ ] T004 Implement mode registry and validation helpers in transformation-modes.js
- [ ] T005 Implement encode transforms (base64_utf8, url_percent, hex_utf8) in text-transformer.js
- [ ] T006 Implement hash transforms (sha256_hex, sha384_hex, sha512_hex) using Web Crypto in text-transformer.js
- [ ] T007 Implement shared applyTransformation(text, modeId) with safe fallback none in text-transformer.js
- [ ] T008 Integrate async-safe transformation state flow in app.js
- [ ] T009 Add Web Crypto capability detection and hash-option availability mapping in app.js

**Checkpoint**: Foundation complete, user stories can be implemented and tested independently

---

## Phase 3: User Story 1 - Generate QR from transformed text (Priority: P1) MVP

**Goal**: User can select one encode/hash mode and get transformed output plus matching QR payload

**Independent Test**: Enter text, select an encode mode then a hash mode, verify displayed result equals QR payload in both cases

- [ ] T010 [P] [US1] Add transformation mode dropdown options (3 encode + 3 hash) in index.html
- [ ] T011 [US1] Add transformation result output container under dropdown in index.html
- [ ] T012 [US1] Wire dropdown change events to transformation pipeline in app.js
- [ ] T013 [P] [US1] Render transformed result text in transformation result container in app.js
- [ ] T014 [US1] Update QR render input to always use transformed result in app.js
- [ ] T015 [US1] Handle async race conditions so only latest text+mode result is rendered in app.js

**Checkpoint**: US1 fully functional and independently testable

---

## Phase 4: User Story 2 - Keep original text when no transformation (Priority: P2)

**Goal**: User can choose none mode and preserve existing behavior

**Independent Test**: Select none mode, generate QR, verify result text equals original input exactly

- [ ] T016 [US2] Add explicit none option as default selected value in index.html
- [ ] T017 [P] [US2] Implement none mode behavior to return source text unchanged in text-transformer.js
- [ ] T018 [P] [US2] Ensure empty input handling keeps result/QR cleared with user feedback in app.js
- [ ] T019 [US2] Preserve existing save/share/clear behavior with none mode flow in app.js

**Checkpoint**: US2 functional independently and does not regress baseline behavior

---

## Phase 5: User Story 3 - Select method clearly via one dropdown (Priority: P3)

**Goal**: User can clearly understand and choose one transformation method from a single control

**Independent Test**: Open dropdown and verify 7 options (3 encode, 3 hash, 1 none) are visible and selectable with clear labels

- [ ] T020 [US3] Add grouped and user-friendly labels for mode options in index.html
- [ ] T021 [P] [US3] Add disabled state and helper message when hash is unavailable in app.js
- [ ] T022 [P] [US3] Add visual styles for result states (none, encoded, hashed, error) in styles.css
- [ ] T023 [US3] Add unknown mode fallback to none with visible status message in app.js

**Checkpoint**: US3 functional independently with clear and robust UX

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, performance, and documentation updates

- [ ] T024 [P] Update quick usage section for transformation modes in README.md
- [ ] T025 Verify quickstart scenario steps for encode/hash/none in specs/001-text-encode-hash/quickstart.md
- [ ] T026 Add manual validation checklist for transformed-result-equals-qr in specs/001-text-encode-hash/quickstart.md
- [ ] T027 Run build and smoke commands documented in package.json
- [ ] T028 [P] Update feature contract notes with final UI identifiers in specs/001-text-encode-hash/contracts/transformation-ui-contract.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): starts immediately
- Foundational (Phase 2): depends on Setup and blocks all user stories
- User Story phases (Phase 3 to 5): depend on Foundational completion
- Polish (Phase 6): depends on completion of selected user stories

### User Story Dependencies

- US1 (P1): starts after Phase 2, no dependency on US2 or US3
- US2 (P2): starts after Phase 2, independent from US1 implementation details
- US3 (P3): starts after Phase 2, independent from US1 and US2 business flow

### Suggested Delivery Order

- MVP: Phase 1 -> Phase 2 -> Phase 3 (US1)
- Increment 2: Add Phase 4 (US2)
- Increment 3: Add Phase 5 (US3)
- Finalize: Phase 6

---

## Parallel Opportunities

- Setup: T002 and T003 can run in parallel after T001
- User Story 1: T010 and T013 can run in parallel after foundational completion
- User Story 2: T017 and T018 can run in parallel
- User Story 3: T021 and T022 can run in parallel
- Polish: T024 and T028 can run in parallel

### Parallel Example: User Story 1

- Run T010 and T013 in parallel (index option set and app render logic)
- Then run T012, T014, and T015 sequentially

### Parallel Example: User Story 2

- Run T017 and T018 in parallel (transformer and app state handling)

### Parallel Example: User Story 3

- Run T021 and T022 in parallel (behavior in app.js and styles in styles.css)

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 and Phase 2
2. Deliver Phase 3 (US1)
3. Validate independent test for US1
4. Demo/deploy MVP

### Incremental Delivery

1. Add US2 and validate no-transformation baseline behavior
2. Add US3 and validate dropdown clarity and robustness
3. Complete polish tasks and final checks

### Team Parallel Strategy

1. One developer completes foundational transformer core (T004 to T007)
2. One developer prepares UI structure/styling (T002, T003, T010, T011, T022)
3. One developer handles app orchestration and robustness (T008, T009, T012 to T023)
