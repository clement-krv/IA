# Feature Specification: Encodage et Hash du Texte

**Feature Branch**: `001-text-encode-hash`  
**Created**: 2026-03-23  
**Status**: Draft  
**Input**: User description: "Rajoute une feature qui permet d'encoder le texte écrit avec le système d'encodage qu'on souhaite (3 max) ou alors de le hasher avec 3 aussi possibilité, choix par dropdown, résultat affiché en dessous avec le QR code, avec possibilité de ne rien faire."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Générer un QR à partir d’un texte transformé (Priority: P1)

En tant qu’utilisateur, je veux saisir un texte, choisir une méthode de transformation (encodage ou hash), puis générer un QR code contenant ce résultat.

**Why this priority**: C’est la valeur principale de la fonctionnalité demandée.

**Independent Test**: Peut être testé en saisissant un texte, en choisissant une transformation dans le dropdown, puis en vérifiant que le résultat affiché et le contenu du QR sont identiques.

**Acceptance Scenarios**:

1. **Given** un texte saisi et une méthode d’encodage sélectionnée, **When** l’utilisateur génère le QR, **Then** le résultat encodé est affiché et le QR contient ce résultat encodé.
2. **Given** un texte saisi et une méthode de hash sélectionnée, **When** l’utilisateur génère le QR, **Then** le résultat hashé est affiché et le QR contient ce résultat hashé.

---

### User Story 2 - Ne pas transformer le texte (Priority: P2)

En tant qu’utilisateur, je veux pouvoir laisser le texte sans transformation pour générer un QR avec le texte original.

**Why this priority**: Cette option garantit la compatibilité avec l’usage actuel et répond explicitement à la demande "ne rien faire".

**Independent Test**: Peut être testé en sélectionnant l’option "Aucune transformation" puis en vérifiant que le résultat affiché est exactement le texte saisi.

**Acceptance Scenarios**:

1. **Given** un texte saisi et l’option "Aucune transformation" sélectionnée, **When** l’utilisateur génère le QR, **Then** le texte affiché et le contenu du QR sont identiques au texte original.

---

### User Story 3 - Choisir facilement la méthode (Priority: P3)

En tant qu’utilisateur, je veux choisir la méthode via un dropdown unique pour éviter toute ambiguïté entre encodage, hash et aucune transformation.

**Why this priority**: Cette histoire améliore la clarté de l’interface et réduit les erreurs de sélection.

**Independent Test**: Peut être testé en ouvrant le dropdown et en vérifiant que toutes les options attendues sont présentes et sélectionnables.

**Acceptance Scenarios**:

1. **Given** l’écran de génération QR, **When** l’utilisateur ouvre le dropdown, **Then** il voit 3 options d’encodage, 3 options de hash et 1 option sans transformation.

### Edge Cases

- Texte vide: la génération ne doit pas produire de transformation invalide et doit informer clairement l’utilisateur.
- Texte très long: la transformation doit produire un résultat complet sans tronquer silencieusement la donnée affichée.
- Changement de méthode après saisie: le résultat affiché et le QR doivent refléter uniquement la méthode actuellement sélectionnée.
- Valeur de méthode indisponible ou non reconnue: le système revient à "Aucune transformation" et informe l’utilisateur.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système MUST permettre la saisie d’un texte brut à transformer avant génération du QR code.
- **FR-002**: Le système MUST proposer exactement 3 méthodes d’encodage sélectionnables dans un dropdown.
- **FR-003**: Le système MUST proposer exactement 3 méthodes de hash sélectionnables dans le même dropdown.
- **FR-004**: Le système MUST proposer une option explicite "Aucune transformation" dans le dropdown.
- **FR-005**: Le système MUST appliquer uniquement la méthode sélectionnée à l’instant de la génération.
- **FR-006**: Le système MUST afficher sous le sélecteur le résultat final (encodé, hashé ou original).
- **FR-007**: Le système MUST générer un QR code dont le contenu est strictement égal au résultat final affiché.
- **FR-008**: Le système MUST mettre à jour le résultat et le QR à chaque nouvelle génération, sans conserver un ancien résultat non conforme.
- **FR-009**: Le système MUST empêcher la génération silencieuse lorsque le texte saisi est vide et fournir un retour utilisateur compréhensible.
- **FR-010**: Le système MUST conserver le comportement existant de génération QR pour les cas "Aucune transformation".

### Key Entities *(include if feature involves data)*

- **Texte Source**: Contenu saisi par l’utilisateur avant transformation.
- **Mode de Transformation**: Option unique choisie dans le dropdown (encodage, hash ou aucune transformation).
- **Résultat Transformé**: Valeur finale affichée à l’écran, dérivée du Texte Source selon le Mode de Transformation.
- **Contenu QR**: Donnée encodée dans le QR code, qui doit être identique au Résultat Transformé.

## Assumptions

- Les 3 méthodes d’encodage et les 3 méthodes de hash sont prédéfinies et documentées dans l’interface.
- L’utilisateur ne combine pas plusieurs méthodes en même temps; une seule méthode est appliquée par génération.
- La fonctionnalité reste disponible sans authentification supplémentaire.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% des générations avec une méthode sélectionnée affichent un résultat textuel non ambigu sous le dropdown.
- **SC-002**: 100% des QR générés contiennent exactement la même valeur que le résultat affiché à l’utilisateur.
- **SC-003**: Au moins 95% des utilisateurs de test complètent la génération (saisie + choix + QR) en moins de 30 secondes.
- **SC-004**: Le taux d’échec de génération dû à un mauvais choix de transformation reste inférieur à 2% sur un jeu de tests représentatif.
