# Data Model: Encodage et Hash du Texte

**Created**: 2026-03-23  
**Purpose**: Define runtime entities, validation rules, and state transitions for text transformation before QR generation  
**Persistence**: None (runtime memory only)

## Entities

### 1. SourceText

**Description**: Texte brut saisi par l'utilisateur.

**Fields**:
- `value`: string
- `length`: number (computed)

**Validation**:
- Peut etre vide (mais generation bloquee avec feedback)
- Doit rester compatible UTF-8

---

### 2. TransformationMode

**Description**: Option selectionnee dans le dropdown unique.

**Fields**:
- `id`: string
- `category`: enum (`none`, `encode`, `hash`)
- `label`: string
- `enabled`: boolean

**Allowed values**:
- `none`: `none`
- `encode`: `base64_utf8`, `url_percent`, `hex_utf8`
- `hash`: `sha256_hex`, `sha384_hex`, `sha512_hex`

**Validation**:
- Une seule valeur active a la fois
- Si valeur inconnue: fallback `none`

---

### 3. TransformationResult

**Description**: Valeur finale affichee sous le dropdown et encodee dans le QR.

**Fields**:
- `value`: string
- `sourceModeId`: string
- `isDerived`: boolean
- `updatedAt`: number (timestamp runtime)

**Validation**:
- `value` doit etre exactement la sortie de la transformation appliquee a `SourceText.value`
- Si mode `none`: `value === SourceText.value`

---

### 4. QrPayload

**Description**: Charge utile envoyee au generateur QR.

**Fields**:
- `text`: string
- `errorCorrectionLevel`: enum (`L`, `M`, `Q`, `H`)

**Validation**:
- `text` doit etre strictement egal a `TransformationResult.value`
- Aucun rendu QR si `text` vide

---

## State Transitions

1. **Init**
- `SourceText.value = ""`
- `TransformationMode.id = "none"`
- `TransformationResult.value = ""`
- QR vide

2. **User Input Change**
- Recalcule `SourceText`
- Applique `TransformationMode`
- Met a jour `TransformationResult`
- Met a jour `QrPayload` puis rendu

3. **Mode Change (Dropdown)**
- Reapplique transformation sur le texte courant
- Met a jour `TransformationResult`
- Regenere QR avec la nouvelle sortie

4. **Clear All**
- Reset de `SourceText`
- `TransformationResult` vide
- QR vide
- Le mode selectionne peut rester sur la derniere valeur (decision UX), mais la sortie doit etre vide

---

## Derived Functions

- `applyTransformation(text, modeId) -> Promise<string>`
: Encodage sync et hash async via Web Crypto.

- `hashToHex(buffer) -> string`
: Convertit un `ArrayBuffer` de digest en hexa minuscule.

- `encodeUtf8ToHex(text) -> string`
: Convertit les bytes UTF-8 en hexa.

---

## Error Handling Rules

- `SourceText` vide: message utilisateur et absence de rendu QR.
- Mode hash indisponible (Web Crypto absent): options hash desactivees + message.
- Erreur transformation: fallback securise vers message d'erreur visible, sans crash UI.
