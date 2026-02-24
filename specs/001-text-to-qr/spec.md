# Feature Specification: QR-Text Local-First

**Feature Branch**: `001-text-to-qr`  
**Created**: 2026-02-24  
**Status**: Draft  
**Input**: User description: "Application web permettant aux utilisateurs de transférer rapidement du texte d'un ordinateur vers un téléphone en générant un QR code. L'utilisateur saisit du texte dans un éditeur plein écran, un QR code est généré instantanément et peut être scanné par n'importe quel téléphone pour récupérer le texte. Tout fonctionne localement dans le navigateur sans connexion réseau externe."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Génération instantanée de QR code (Priority: P1)

Léa (persona Rapidité) ouvre l'application web sur son ordinateur, commence immédiatement à taper une URL dans l'éditeur qui s'affiche au centre de l'écran, et voit un QR code généré en temps réel au fur et à mesure de sa saisie. Elle scanne le code avec son téléphone et accède instantanément à l'URL.

**Why this priority**: C'est le cœur de la proposition de valeur. Sans génération rapide et fiable de QR code, l'application n'a aucune utilité. Répond directement à la mission "moyen le plus rapide de transférer du texte" et au pilier Zero-Latency UI.

**Independent Test**: Peut être testé en ouvrant l'application, tapant du texte, et vérifiant qu'un QR code apparaît et est scannable par n'importe quel téléphone. Délivre une valeur immédiate et complète.

**Acceptance Scenarios**:

1. **Given** l'utilisateur ouvre l'application web, **When** la page se charge, **Then** un éditeur de texte prominent s'affiche dans une carte centrée avec le focus automatique en moins de 500ms
2. **Given** l'éditeur est affiché, **When** l'utilisateur tape du texte (≤ 2000 caractères), **Then** un QR code est généré et affiché en moins de 100ms
3. **Given** un QR code est affiché, **When** l'utilisateur scanne le code avec un téléphone iOS ou Android, **Then** le texte exact est lisible sur l'appareil mobile
4. **Given** l'utilisateur continue de taper, **When** le texte est modifié, **Then** le QR code se met à jour automatiquement sans délai perceptible

---

### User Story 2 - Édition de texte sans limites (Priority: P2)

Un utilisateur doit transférer un long texte (article, code, configuration) vers son téléphone. Il colle le texte dans l'éditeur, et le système affiche un compteur de caractères avec une barre de progression indiquant la proximité de la limite de scannabilité (2000 caractères recommandés). Le système génère automatiquement un QR code adaptatif : pour les textes courts, un QR code compact ; pour les textes approchant 2000 caractères, un rendu optimisé avec indication visuelle.

**Why this priority**: Étend l'utilité au-delà des URLs courtes. Permet des cas d'usage variés (secrets, configurations, snippets de code) tout en maintenant la compatibilité universelle. Le feedback visuel (compteur + barre) guide l'utilisateur sans bloquer.

**Independent Test**: Peut être testé en collant différentes longueurs de texte, en observant la progression du compteur, et en vérifiant que le QR code reste scannable. Fonctionne indépendamment de US1.

**Acceptance Scenarios**:

1. **Given** l'utilisateur a du texte dans son presse-papiers, **When** il colle le texte (Ctrl+V ou Cmd+V), **Then** le texte s'affiche dans l'éditeur et un QR code correspondant est généré
2. **Given** du texte est présent dans l'éditeur, **When** l'utilisateur continue de taper, **Then** un compteur affiche "X / 2000" et une barre de progression se remplit proportionnellement
3. **Given** le texte dépasse 2000 caractères, **When** le QR code est généré, **Then** un niveau de correction d'erreur adapté est utilisé et un avertissement visuel (warning) indique une scannabilité dégradée
4. **Given** un texte très long (> 5000 caractères), **When** le QR code est généré, **Then** l'utilisateur voit un message "Hard limit reached" avec recommandation de réduire le texte

---

### User Story 3 - Sauvegarde et partage local (Priority: P3)

Un utilisateur a généré un QR code qu'il souhaite réutiliser dans un document ou partager via une autre application. Il clique sur le bouton "Save" et télécharge le QR code en tant qu'image PNG haute qualité, ou utilise le bouton "Share" pour envoyer l'image via les applications locales de son système (email, messagerie, etc.).

**Why this priority**: Permet la réutilisation du QR code généré (impression, insertion dans PowerPoint, envoi par email) sans compromettre la vie privée. Étend l'utilité au-delà du scan immédiat.

**Independent Test**: Peut être testé en générant un QR code, en cliquant sur "Save" (vérifie le téléchargement PNG), et en cliquant sur "Share" (vérifie l'invocation du Web Share API). Fonctionne indépendamment des autres stories.

**Acceptance Scenarios**:

1. **Given** un QR code est affiché, **When** l'utilisateur clique sur "Save Image", **Then** le navigateur télécharge une image PNG haute qualité du QR code (minimum 512x512 pixels) sans appel réseau
2. **Given** un QR code est affiché et le navigateur supporte Web Share API, **When** l'utilisateur clique sur "Share", **Then** le système d'exploitation affiche le sélecteur de partage natif avec l'image du QR code
3. **Given** un QR code est affiché et le navigateur ne supporte pas Web Share API, **When** l'utilisateur survole "Share", **Then** le bouton est désactivé ou affiche un tooltip "Not supported"
4. **Given** l'utilisateur sauvegarde ou partage un QR code, **When** l'opération s'exécute, **Then** aucune requête réseau n'est effectuée (vérifiable via DevTools Network tab)

---

### User Story 4 - Mode sombre et paramètres utilisateur (Priority: P4)

Un utilisateur travaille dans un environnement sombre (bureau la nuit, transport en commun) et ouvre l'application. Le système détecte automatiquement la préférence de thème sombre du navigateur. L'utilisateur peut manuellement basculer entre mode clair, sombre ou automatique via une icône de paramètres (gear icon). Il peut également ajuster le niveau de correction d'erreur du QR code (L/M/Q/H) selon ses besoins.

**Why this priority**: Améliore l'expérience utilisateur et la scannabilité dans différentes conditions d'éclairage. Donne le contrôle aux utilisateurs avancés. Répond au pilier Universal Scannability en optimisant le contraste.

**Independent Test**: Peut être testé en changeant les préférences système (thème clair/sombre), en utilisant le menu de paramètres pour forcer un thème, et en modifiant le niveau de correction d'erreur. Le QR code reste scannable dans tous les modes.

**Acceptance Scenarios**:

1. **Given** le système d'exploitation de l'utilisateur est en mode sombre, **When** l'application se charge, **Then** l'interface s'affiche avec un thème sombre (fond beige foncé, carte sur fond noir)
2. **Given** l'application est en mode sombre, **When** un QR code est généré, **Then** le code est affiché sur une carte blanche avec une "Quiet Zone" (bordure blanche) d'au moins 4 modules pour garantir la détection
3. **Given** l'utilisateur clique sur l'icône de paramètres (gear), **When** le menu s'ouvre, **Then** des options apparaissent : Theme (Light/Dark/System) et QR Error Correction (L/M/Q/H)
4. **Given** l'utilisateur change le thème manuellement, **When** l'interface bascule, **Then** aucune donnée texte n'est perdue et le QR code reste affiché
5. **Given** l'utilisateur sélectionne un niveau de correction d'erreur différent, **When** le paramètre est appliqué, **Then** le QR code est regénéré avec le nouveau niveau sans délai perceptible

---

### User Story 5 - Effacement sécurisé (Priority: P5)

Marc (persona Sécurité) vient de transférer un mot de passe temporaire via QR code. Une fois le scan effectué, il appuie sur le bouton "Clear All" pour effacer immédiatement le texte et le QR code de l'écran, sans laisser de traces.

**Why this priority**: Répond aux besoins de confidentialité (Local Seclusion). Critique pour les utilisateurs manipulant des données sensibles.

**Independent Test**: Peut être testé en saisissant du texte, cliquant sur "Clear All", et vérifiant que tout est effacé. Fonctionne indépendamment des autres stories.

**Acceptance Scenarios**:

1. **Given** du texte est présent dans l'éditeur et un QR code est affiché, **When** l'utilisateur clique sur "Clear All", **Then** le texte et le QR code disparaissent immédiatement (< 16ms)
2. **Given** le texte a été effacé, **When** l'utilisateur inspecte la console développeur ou l'état de l'application, **Then** aucune trace du texte saisi n'est présente en mémoire ou dans les logs
3. **Given** l'utilisateur a effacé le texte, **When** il recharge la page, **Then** aucun texte n'est restauré (pas d'historique persistant)

---

### Edge Cases

- **Texte extrêmement long (> 5000 caractères hard limit)** : Le système doit afficher un message d'erreur clair indiquant que le texte dépasse la limite de scannabilité et bloquer la génération du QR code jusqu'à réduction. Alternative : générer avec Level L et afficher un warning critique.

- **Caractères spéciaux et emojis** : Le système doit encoder correctement les caractères Unicode (emojis, caractères accentués, symboles) dans le QR code sans corruption de données.

- **Connexion réseau coupée** : L'application doit continuer de fonctionner normalement car toute la logique est côté client. Aucun message d'erreur réseau ne doit apparaître.

- **Navigateur obsolète (Internet Explorer 11)** : L'application doit afficher un message indiquant que le navigateur n'est pas supporté et recommander Chrome, Firefox, Safari ou Edge moderne.

- **Écran très petit (smartphone)** : L'éditeur doit s'adapter et rester utilisable. Le QR code peut être généré mais l'utilisateur est averti que scanner depuis le même appareil n'a pas de sens (on génère sur desktop, on scanne sur mobile).

- **Texte vide** : Si aucun texte n'est saisi, aucun QR code n'est affiché. L'interface montre un état vide propre.

- **Scan échoué (faible luminosité, angle incorrect)** : Problème côté utilisateur, pas de contrôle applicatif. L'application garantit la qualité du QR généré (contraste, taille, correction d'erreur).

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

**Core Functionality**

- **FR-001**: System MUST provide a prominent, centered card layout with an auto-expanding text editor accessible immediately upon page load (< 500ms Time-to-Interactive)
- **FR-002**: System MUST automatically focus the text editor on page load to enable immediate typing
- **FR-003**: System MUST generate a QR code in real-time as the user types, with maximum 100ms latency for texts ≤ 2000 characters
- **FR-004**: System MUST support text encoding in UTF-8 to handle all Unicode characters (emojis, accents, special symbols)
- **FR-005**: Users MUST be able to clear all text and QR code instantly via a "Clear All" button (< 16ms response time)

**Privacy & Security (Local Seclusion)**

- **FR-006**: System MUST NOT send any user data to external servers or APIs
- **FR-007**: System MUST NOT use analytics or tracking libraries that collect user behavior
- **FR-008**: System MUST NOT store text in cookies, localStorage, sessionStorage, or any persistent storage
- **FR-009**: System MUST NOT log user-entered text in browser console or system logs
- **FR-010**: All QR code generation and text processing MUST execute client-side only (in-browser JavaScript). All image generation for "Save" or "Share" actions MUST be performed via client-side Blobs or Data URLs. No server-side rendering or temporary cloud storage is permitted.

**Compatibility (Universal Scannability)**

- **FR-011**: QR codes MUST be scannable by iOS devices (current version and 2 previous major versions)
- **FR-012**: QR codes MUST be scannable by Android devices (current version and 3 previous major versions)
- **FR-013**: QR codes MUST use error correction level M minimum (15% data restoration capability)
- **FR-014**: QR codes MUST maintain sufficient contrast ratio (minimum 4.5:1) in both light and dark modes
- **FR-015**: System MUST adapt QR code size based on text length to ensure scannability on cameras with minimum 5MP resolution

**User Experience**

- **FR-016**: System MUST detect user's preferred color scheme (light/dark) via CSS media query `prefers-color-scheme`
- **FR-017**: System MUST render QR codes using SVG or Canvas (browser-dependent) for optimal quality
- **FR-018**: System MUST display visual feedback when text exceeds recommended limits (> 2000 characters soft limit, > 5000 characters hard limit)
- **FR-019**: System MUST work fully offline after initial page load (no network dependency)
- **FR-020**: System MUST provide a clean, minimalist interface with no distractions (no ads, no navigation menus)

**Additional Features (Aligned with UI Mockup)**

- **FR-021**: System MUST allow users to download the generated QR code as a high-quality image file (PNG format, minimum 512x512 pixels) via a "Save Image" button
- **FR-022**: System SHOULD provide access to the Web Share API (where supported by the browser) to send the QR code image to other local applications via a "Share" button. If unsupported, the button must be disabled or hidden.
- **FR-023**: System MUST provide a visual character counter displaying "X / 2000" and a progress bar indicating proximity to the soft limit (2000 characters optimal for scannability)
- **FR-024**: System MUST provide a settings menu (accessible via a gear icon) to allow manual theme overrides (Light/Dark/System) and QR error correction level selection (L/M/Q/H)
- **FR-025**: The QR code component MUST include a mandatory "Quiet Zone" (white border) of at least 4 modules wide around the QR code to ensure reliable detection against non-white backgrounds (especially in dark mode with beige/cream surrounding backgrounds)

### Key Entities

- **Text Input**: The user's text content entered in the editor. Attributes include raw string value, character count, and encoding format (UTF-8). Exists only in runtime memory, never persisted.

- **QR Code**: Visual representation of the text input. Attributes include encoding mode, error correction level, version (size), and rendering format (SVG/Canvas). Generated on-demand and destroyed when text is cleared.

- **Theme Preference**: User's color scheme preference (light or dark mode). Detected from browser/OS settings, not stored by the application.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

**Performance (Zero-Latency UI)**

- **SC-001**: Application Time-to-Interactive is less than 500ms on 3G mobile connection
- **SC-002**: QR code generation completes in less than 100ms for texts containing up to 2000 characters
- **SC-003**: Clear All action responds in less than 16ms (one frame at 60fps)
- **SC-004**: Initial JavaScript bundle size is less than 50KB (minified and gzipped)
- **SC-005**: Lighthouse Performance Score is 95 or higher
- **SC-006**: Core Web Vitals metrics are all "Good" (LCP < 2.5s, FID < 100ms, CLS < 0.1)

**Compatibility (Universal Scannability)**

- **SC-007**: QR codes generated by the application are successfully scannable by 95%+ of iOS devices (iPhone 8 and newer)
- **SC-008**: QR codes generated by the application are successfully scannable by 95%+ of Android devices (Android 8.0 Oreo and newer)
- **SC-009**: QR codes remain scannable at minimum camera resolution of 5MP under normal lighting conditions
- **SC-010**: Scan success rate is above 98% for texts under 1000 characters

**Privacy & Security (Local Seclusion)**

- **SC-011**: Zero network requests are made to external domains during application usage (verified via browser DevTools Network tab)
- **SC-012**: No user-entered text appears in browser console logs or application logs
- **SC-013**: No user data is stored in browser storage mechanisms (verified via Application/Storage inspection)
- **SC-014**: Application functions identically with network disabled (airplane mode / offline)

**User Experience**

- **SC-015**: Users can complete the full workflow (enter text → generate QR → scan → clear) in under 15 seconds
- **SC-016**: First-time users successfully generate a scannable QR code on their first attempt without instructions (usability testing with 90%+ success rate)
- **SC-017**: Application maintains responsive interaction (no lag or freezing) with texts up to 5000 characters
- **SC-018**: The "Save Image" and "Share" actions trigger zero network calls and generate files entirely within the browser's memory (verified via DevTools Network tab monitoring during Save/Share operations)
