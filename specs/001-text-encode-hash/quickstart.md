# Quickstart: Feature Encodage/Hash + QR

## Objectif

Activer la nouvelle feature qui transforme le texte (encodage/hash/none) avant generation QR.

## Prerequis

- Node.js 18+
- Dependances installees (`npm install`)
- Navigateur moderne

## Lancer en local

```bash
npm run dev
```

Ouvrir `http://localhost:8000`.

## Verification rapide (manuel)

1. Saisir `Bonjour` dans la zone de texte.
2. Choisir `Aucune transformation` dans le dropdown.
3. Verifier que le resultat affiche est `Bonjour`.
4. Verifier que le QR encode `Bonjour` (scan smartphone).

5. Choisir `Base64 (UTF-8)`.
6. Verifier que le resultat affiche est `Qm9uam91cg==`.
7. Verifier que le QR encode `Qm9uam91cg==`.

8. Choisir `SHA-256`.
9. Verifier qu'un hash hexa est affiche.
10. Verifier que le QR encode exactement ce hash.

## Cas limites a valider

- Texte vide: pas de QR et message utilisateur clair.
- Changement rapide de mode: resultat et QR toujours synchronises.
- Texte long: UI reste reactive, warning existant conserve.

## Checklist manuelle: resultat affiche = payload QR

- [ ] Mode `none`: le texte visible dans `#transformation-result` est identique au texte scanne du QR.
- [ ] Mode `base64_utf8`: la chaine visible est identique au texte scanne du QR.
- [ ] Mode `url_percent`: la chaine visible est identique au texte scanne du QR.
- [ ] Mode `hex_utf8`: la chaine visible est identique au texte scanne du QR.
- [ ] Mode `sha256_hex`: la chaine visible est identique au texte scanne du QR.
- [ ] Mode `sha384_hex`: la chaine visible est identique au texte scanne du QR.
- [ ] Mode `sha512_hex`: la chaine visible est identique au texte scanne du QR.

## Tests automatises recommandes

```bash
npm run test:e2e
npm run lhci
```

Points cibles:
- Aucun appel reseau additionnel durant les transformations
- Regressions perf absentes sur la generation QR

## Definition of Done (feature)

- Dropdown present avec 7 options (3 encode, 3 hash, 1 none)
- Resultat visible sous le dropdown
- Contenu QR strictement egal au resultat visible
- Option none preserve le comportement historique
