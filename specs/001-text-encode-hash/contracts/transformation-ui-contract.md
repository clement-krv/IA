# UI Contract: Text Transformation and QR Payload

## Scope

Contract d'interface entre les interactions utilisateur (textarea + dropdown) et le pipeline de rendu du resultat/QR.

## Inputs

### Text Input
- Element: `#text-input`
- Type: multiline string
- Events: `input`

### Transformation Dropdown
- Element: `#transformation-mode`
- Type: single-select
- Events: `change`

#### Allowed option IDs
- `none`
- `base64_utf8`
- `url_percent`
- `hex_utf8`
- `sha256_hex`
- `sha384_hex`
- `sha512_hex`

## Outputs

### Transformation Result Display
- Element: `#transformation-result`
- Rule: toujours afficher la valeur finale utilisee pour le QR
- Empty input behavior: valeur vide + message d'etat

### QR Container
- Element: `#qr-container`
- Rule: encoder exactement la meme chaine que `#transformation-result`

## Behavioral Contract

1. Sur chaque `input` ou `change`:
- Recalculer la transformation active
- Mettre a jour `#transformation-result`
- Regenerer le QR avec cette valeur

2. Option `none`:
- Sortie identique a l'entree

3. Options `encode`:
- Sortie synchrones

4. Options `hash`:
- Sorties asynchrones via Web Crypto
- L'etat final visible doit correspondre au dernier couple (texte, mode) actif

5. Robustesse:
- Si mode inconnu: fallback `none`
- Si hash indisponible: options hash desactivees et message utilisateur

## Acceptance Invariants

- Invariant A: `transformationResult === qrPayloadText`
- Invariant B: aucune requete reseau pendant transformation
- Invariant C: aucune persistance locale de texte ou resultat
