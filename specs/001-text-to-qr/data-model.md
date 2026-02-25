# Data Model: QR-Text Local-First

**Created**: 2026-02-25  
**Purpose**: Define entities, state management, and validation rules  
**Persistence**: ❌ None (all state is runtime-only per FR-008)

## Core Principle

**All data exists only in browser memory (DOM + JavaScript variables). No persistence to localStorage, sessionStorage, cookies, or IndexedDB.**

This is a constitutional requirement (Principle I: Local Seclusion). On page reload, all state is lost.

---

## Entities

### 1. Text Input

**Description**: The user's text content entered in the textarea

**Attributes**:
- `value`: string — The raw text entered by user
- `length`: number (computed) — Character count (`value.length`)
- `encoding`: constant — Always UTF-8 (implicit)

**State Lifecycle**:
- **Created**: When user types or pastes text
- **Updated**: On every `input` event (real-time)
- **Destroyed**: On "Clear All" click or page unload

**Validation Rules**:
- **Soft limit**: 2000 characters (FR-023: show warning, allow continuation)
- **Hard limit**: 5000 characters (FR-018: show critical warning, discourage but don't block)
- **Encoding**: Must support all Unicode characters (FR-004)

**Persistence**: ❌ None  
**Storage Location**: DOM `<textarea>` element value + JavaScript variable

**Example State**:
```javascript
{
  value: "https://example.com",
  length: 19,
  encoding: "UTF-8"
}
```

---

### 2. QR Code

**Description**: Visual representation of text input as a QR code

**Attributes**:
- `content`: string — The text to encode (same as Text Input value)
- `errorCorrectionLevel`: enum — 'L' | 'M' | 'Q' | 'H' (default: 'M')
- `version`: number (auto-computed) — QR version 1-40 based on content length
- `moduleCount`: number (computed) — Number of modules (e.g., 33 for version 5)
- `quietZone`: constant — 4 modules (FR-025)
- `renderFormat`: enum — 'SVG' | 'Canvas' (browser-dependent)
- `dataURL`: string (optional) — Base64 PNG data URL for Save/Share

**State Lifecycle**:
- **Created**: When text input becomes non-empty
- **Updated**: On every Text Input change (debounced 50ms for performance)
- **Destroyed**: When text input is cleared or page unloads

**Validation Rules**:
- **Max capacity**: Depends on error correction level and version (auto-computed by library)
- **Contrast**: Minimum 4.5:1 ratio in both light/dark modes (FR-014)
- **Generation time**: < 100ms for texts ≤ 2000 characters (SC-002)

**Persistence**: ❌ None  
**Storage Location**: DOM `<svg>` or `<canvas>` element + JavaScript object

**State Transitions**:
```
Empty Input → No QR Code
Text Entered → Generate QR (SVG)
Text Updated → Regenerate QR (debounced)
"Save Image" Clicked → Generate PNG data URL → Trigger download
"Clear All" Clicked → Destroy QR
```

**Example State**:
```javascript
{
  content: "https://example.com",
  errorCorrectionLevel: 'M',
  version: 2,
  moduleCount: 25,
  quietZone: 4,
  renderFormat: 'SVG',
  dataURL: null  // Only computed on-demand for Save/Share
}
```

---

### 3. Theme Preference

**Description**: User's color scheme preference (light/dark/system)

**Attributes**:
- `mode`: enum — 'light' | 'dark' | 'system' (default: 'system')
- `resolved`: enum (computed) — 'light' | 'dark' (after resolving 'system' via media query)

**State Lifecycle**:
- **Created**: On page load (default: 'system')
- **Updated**: When user changes theme in settings menu (FR-024)
- **Destroyed**: On page unload (**no persistence per FR-016**)

**Validation Rules**:
- Must respect `prefers-color-scheme` media query when mode = 'system'
- Must update QR Code contrast when theme changes (FR-014)

**Persistence**: ❌ None (resets to 'system' on page reload)  
**Storage Location**: JavaScript variable + `data-theme` attribute on `<html>`

**State Transitions**:
```
Page Load → mode = 'system' → resolved via CSS media query
User Selects "Dark" → mode = 'dark' → resolved = 'dark'
User Selects "System" → mode = 'system' → resolved = (media query result)
Page Reload → Reset to 'system'
```

**Example State**:
```javascript
{
  mode: 'dark',           // User's explicit choice
  resolved: 'dark'        // What's actually displayed
}
```

---

### 4. Settings

**Description**: User's application settings (theme + QR error correction level)

**Attributes**:
- `theme`: Theme Preference (see above)
- `qrErrorCorrection`: enum — 'L' | 'M' | 'Q' | 'H' (default: 'M')
- `isOpen`: boolean — Settings menu visibility state

**State Lifecycle**:
- **Created**: On page load with defaults
- **Updated**: When user interacts with settings menu (FR-024)
- **Destroyed**: On page unload (**no persistence**)

**Validation Rules**:
- Error correction level changes must trigger QR regeneration
- Settings menu must not block user input (non-modal)

**Persistence**: ❌ None (all settings reset to defaults on reload)  
**Storage Location**: JavaScript object

**Example State**:
```javascript
{
  theme: { mode: 'system', resolved: 'light' },
  qrErrorCorrection: 'M',
  isOpen: false
}
```

---

### 5. UI State

**Description**: Transient UI state (progress bar, warnings, tooltips)

**Attributes**:
- `characterCount`: number (computed) — Current text length (for "120 / 2000" display)
- `progressPercent`: number (computed) — `(characterCount / 2000) * 100`
- `warningLevel`: enum — 'none' | 'soft' | 'hard'
  - `none`: < 2000 characters
  - `soft`: 2000-4999 characters (yellow warning)
  - `hard`: ≥ 5000 characters (red warning)
- `shareSupported`: boolean (computed) — Result of `navigator.share && navigator.canShare()`
- `tooltipMessage`: string | null — Active tooltip text (or null if hidden)

**State Lifecycle**:
- **Created**: On page load
- **Updated**: On every text input change + user interactions
- **Destroyed**: On page unload

**Persistence**: ❌ None  
**Storage Location**: JavaScript variables + DOM class names

**Example State**:
```javascript
{
  characterCount: 2150,
  progressPercent: 107.5,  // Over 100% = warning state
  warningLevel: 'soft',
  shareSupported: true,
  tooltipMessage: null
}
```

---

## State Management Architecture

### No State Management Library

Given the simplicity of the app (single-user, no persistence, minimal state), **no state management library (Redux, Zustand, etc.) is needed**.

**Approach**: Module-scoped variables + reactive DOM updates

```javascript
// app.js
let appState = {
  textInput: { value: '', length: 0 },
  qrCode: null,
  settings: { theme: { mode: 'system' }, qrErrorCorrection: 'M', isOpen: false },
  ui: { characterCount: 0, progressPercent: 0, warningLevel: 'none' }
};

function updateTextInput(newValue) {
  appState.textInput = { value: newValue, length: newValue.length };
  appState.ui.characterCount = newValue.length;
  appState.ui.progressPercent = (newValue.length / 2000) * 100;
  appState.ui.warningLevel = getWarningLevel(newValue.length);
  
  renderUI();          // Update character counter, progress bar
  generateQRCode();    // Regenerate QR code (debounced)
}
```

**Rationale**: 
- No server sync needed → No complex state management
- No persistence → No need for state rehydration
- Single-user → No concurrency issues
- Minimal state → Simple object mutations are sufficient

---

## Validation Rules Summary

| Entity | Rule | Type | Error Handling |
|--------|------|------|----------------|
| Text Input | ≤ 2000 chars | Soft Limit | Show yellow warning, allow continuation |
| Text Input | ≤ 5000 chars | Hard Limit | Show red warning "Hard limit reached" |
| Text Input | UTF-8 encoding | Required | Browser-native, no validation needed |
| QR Code | Generation < 100ms | Performance | Log warning if exceeded (dev mode only) |
| QR Code | Contrast ≥ 4.5:1 | Accessibility | CSS ensures compliance (no runtime check) |
| QR Code | Quiet Zone = 4 modules | Standard | Enforced in SVG viewBox calculation |
| Theme | Valid mode | Enum | Default to 'system' on invalid input |
| Settings | Valid error correction | Enum | Default to 'M' on invalid input |

---

## Anti-Persistence Safeguards

To actively prevent accidental data persistence (and pass constitution checks), the app includes:

```javascript
// storage-manager.js — Prevents accidental storage violations
export function preventPersistence() {
  // Override localStorage/sessionStorage to throw errors in dev mode
  if (import.meta.env.DEV) {
    const storageHandler = {
      set() { throw new Error('Storage is forbidden per FR-008'); }
    };
    Object.defineProperty(window, 'localStorage', { value: new Proxy({}, storageHandler) });
    Object.defineProperty(window, 'sessionStorage', { value: new Proxy({}, storageHandler) });
  }
  
  // Set no-store cache headers (via server config or meta tag)
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Cache-Control';
  meta.content = 'no-store, must-revalidate';
  document.head.appendChild(meta);
}
```

This ensures:
1. Development errors if storage is used accidentally
2. Browser cache headers prevent unintended text caching
3. Constitutional compliance is enforced at runtime

---

## State Flow Diagram

```
User Types Text
     ↓
Update appState.textInput
     ↓
Compute UI state (counter, progress, warning)
     ↓
Render UI updates (DOM manipulation)
     ↓
Trigger QR generation (debounced 50ms)
     ↓
Update appState.qrCode
     ↓
Render QR to SVG/Canvas
     ↓
User Clicks "Save Image"
     ↓
Generate PNG data URL from SVG/Canvas
     ↓
Trigger browser download (no network call)
     ↓
Data URL discarded (not persisted)
```

**Key Point**: Every arrow in this flow is **in-memory only**. No arrow points to localStorage, network, or disk.
