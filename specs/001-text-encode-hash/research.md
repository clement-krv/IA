# Research: Encodage et Hash du Texte

**Created**: 2026-03-23  
**Purpose**: Phase 0 research to resolve technical choices and integration patterns  
**Status**: Complete

## Decision 1: Encodages disponibles (3 max)

**Decision**: Proposer exactement 3 encodages:
- `Base64 (UTF-8)`
- `URL Percent-Encode`
- `Hex (UTF-8 bytes)`

**Rationale**:
- Ces formats sont standard, lisibles, et purement textuels (compatibles QR).
- Ils couvrent trois usages distincts: transport compact (Base64), inclusion URL (percent-encode), inspection binaire (Hex).
- Ils sont implémentables en natif navigateur sans dépendance externe.

**Alternatives considered**:
- `Base32`: rejeté car moins courant côté web.
- `Quoted-Printable`: rejeté, trop orienté email et plus complexe à expliquer à l'utilisateur.
- `Morse/ROT13`: rejeté, valeur produit faible pour ce contexte.

---

## Decision 2: Hash disponibles (3 max)

**Decision**: Proposer exactement 3 hash:
- `SHA-256`
- `SHA-384`
- `SHA-512`

**Rationale**:
- Algorithmes standards supportés par `crypto.subtle.digest`.
- Bonne gradation sécurité/taille sortie tout en restant prévisible.
- Exécution locale asynchrone compatible avec les contraintes privacy.

**Alternatives considered**:
- `MD5`/`SHA-1`: rejetés (obsolescence sécurité).
- `BLAKE3`: rejeté (non standard Web Crypto, nécessiterait une dépendance JS).
- `Argon2`/`bcrypt`: rejetés (non adaptés à ce besoin de transformation rapide UI).

---

## Decision 3: Option sans transformation

**Decision**: Ajouter `Aucune transformation` comme option par défaut dans le dropdown.

**Rationale**:
- Respect explicite de la demande utilisateur.
- Préserve le comportement actuel de l'application.
- Simplifie la migration fonctionnelle sans régression.

**Alternatives considered**:
- Conserver l'absence de sélection: rejeté car ambigu en UX.
- Checkbox séparée "activer transformation": rejeté, plus d'étapes et moins clair.

---

## Decision 4: Intégration dans le flux existant

**Decision**: Étendre le flux actuel `input -> renderQr` en:
`input + selectedMode -> transformText -> renderResult -> renderQr(transformedText)`

**Rationale**:
- Modifie minimalement l'architecture existante dans `app.js`.
- Garantit la cohérence "résultat affiché == contenu QR".
- Réduit le risque de régression sur save/share/clear.

**Alternatives considered**:
- Générer le QR directement à partir de l'input puis afficher transformation séparée: rejeté, non conforme FR-007.
- Créer un worker dédié: rejeté pour cette itération (complexité inutile tant que perf acceptable).

---

## Decision 5: Représentation de sortie hash

**Decision**: Afficher les hash en hexadécimal minuscule.

**Rationale**:
- Lisible, stable et commun dans les outils de comparaison.
- Évite les caractères spéciaux de Base64 dans certains contextes de scan/copier-coller.

**Alternatives considered**:
- Hash en Base64: rejeté, moins lisible pour validation visuelle.
- Hash en majuscule: rejeté, convention moins fréquente.

---

## Decision 6: Gestion compatibilité Web Crypto

**Decision**: Si `crypto.subtle` indisponible, les options hash sont désactivées avec message explicite; les encodages et "Aucune transformation" restent actifs.

**Rationale**:
- Maintient l'utilité de la feature sans fallback non fiable.
- Respecte la transparence utilisateur et évite les erreurs silencieuses.

**Alternatives considered**:
- Polyfill crypto JS: rejeté (poids bundle/performance).
- Masquer complètement les options hash: rejeté, diagnostic utilisateur moins clair.

---

## Decision 7: Performance de transformation

**Decision**: Conserver le debounce existant (50ms) et exécuter la transformation dans le handler avant rendu final.

**Rationale**:
- Suffisant pour les 6 transformations sélectionnées.
- Évite les recalculs trop fréquents lors de la saisie rapide.

**Alternatives considered**:
- Pas de debounce: rejeté, bruit de rendu inutile.
- Debounce plus long (150ms+): rejeté, dégrade la sensation d'instantanéité.
