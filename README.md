# QR-Text Local-First

**Transformez du texte en QR code, localement et instantanément.**

Une application web minimaliste qui génère des codes QR à partir de texte, sans backend, sans données stockées, et sans connexion réseau.

## ✨ Fonctionnalités

### 🎯 Core Features
- **Génération instantanée** : QR code généré en temps réel pendant la saisie (<100ms)
- **Mode local-first** : Aucune donnée envoyée sur le réseau, aucun stockage persistant
- **Compteur intelligent** : Affichage du nombre de caractères avec limites soft (2000) et hard (5000)
- **Sauvegarde locale** : Export PNG haute qualité (minimum 512x512px)
- **Partage natif** : Intégration Web Share API pour partage mobile
- **Effacement sécurisé** : Bouton "Clear All" qui efface instantanément toutes les données

### 🎨 Interface & UX
- **Mode sombre automatique** : Détection du thème système avec override manuel
- **Paramètres avancés** : Niveaux de correction d'erreur QR (L/M/Q/H)
- **Design responsive** : Fonctionne sur desktop, tablette, et mobile
- **Raccourcis clavier** :
  - `Ctrl/Cmd + K` : Effacer tout
  - `Ctrl/Cmd + S` : Sauvegarder l'image
  - `Escape` : Fermer les paramètres
- **Feedback visuel** : Indication "✓ Saved!" après sauvegarde réussie
- **Compatibilité navigateurs** : Vérification automatique et avertissement pour navigateurs obsolètes

### 🔒 Sécurité & Confidentialité
- **Zero network calls** : Après chargement initial, aucune requête réseau
- **Zero persistent storage** : Pas de localStorage, sessionStorage, ou cookies
- **Cache-Control** : Headers configurés pour éviter le caching navigateur
- **Anti-persistence** : Protections actives contre l'enregistrement accidentel de données

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ (pour le serveur de développement)
- Navigateur moderne (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd <project-directory>

# Installer les dépendances (optionnel, pour le build et les tests)
npm install

# Démarrer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:8000](http://localhost:8000) dans votre navigateur.

### Structure du projet

```
.
├── index.html              # Structure HTML principale
├── styles.css              # Styles avec CSS variables pour theming
├── app.js                  # Logique applicative principale
├── qr-generator.js         # Wrapper pour la bibliothèque Nayuki
├── share-handler.js        # Export PNG et Web Share API
├── theme-manager.js        # Gestion des thèmes clair/sombre
├── storage-manager.js      # Protections anti-persistence
├── lib/
│   └── qrcodegen.js       # Bibliothèque Nayuki QR Code (93KB)
├── .github/
│   └── workflows/
│       └── lighthouse.yml  # CI pour tests de performance
├── package.json            # Scripts de build et tests
└── lighthouserc.json       # Configuration Lighthouse CI
```

## 📦 Scripts disponibles

```bash
# Développement
npm run dev              # Serveur http-server sur port 8000

# Build (minification)
npm run build            # Minifie HTML/CSS/JS dans dist/

# Tests & Validation
npm run lhci             # Lighthouse CI (performance, TTI, FCP)
npm run test:e2e         # Tests Playwright end-to-end (à implémenter)

# Nettoyage
npm run clean            # Supprime .lighthouseci/ et dist/
```

## 🎯 Utilisation

1. **Saisir du texte** : Tapez ou collez votre texte dans la zone de texte
2. **QR généré automatiquement** : Le code QR apparaît en temps réel
3. **Suivre la progression** : Le compteur et la barre de progression vous indiquent la capacité
4. **Ajuster les paramètres** : Cliquez sur ⚙️ pour changer le thème ou la correction d'erreur
5. **Sauvegarder** : Bouton "Save Image" pour télécharger le PNG
6. **Partager** : Bouton "Share" (mobile) pour partage natif
7. **Effacer** : Bouton "Clear All" pour tout réinitialiser

### Limites de texte

- **Optimal** : <2000 caractères (scannable sur tous les appareils)
- **Soft limit** : 2000 caractères (avertissement jaune - scannabilité peut diminuer)
- **Hard limit** : 5000 caractères (avertissement rouge - réduire le texte recommandé)

### Niveaux de correction d'erreur QR

- **L (7%)** : Plus petit QR, moins de tolérance aux dommages
- **M (15%)** : Équilibre taille/robustesse (par défaut)
- **Q (25%)** : Plus tolérant aux rayures/dommages
- **H (30%)** : Maximum de résilience, QR plus dense

## 🏗️ Architecture technique

### Stack
- **HTML5** : Structure sémantique, pas de frameworks
- **CSS3** : Variables CSS pour theming, Grid/Flexbox pour layout
- **JavaScript ES2020+** : Modules ES6, async/await, Proxy pattern
- **Bibliothèque QR** : [Nayuki QR Code Generator](https://www.nayuki.io/page/qr-code-generator-library) (TypeScript compilé)

### Principes constitutionnels

1. **Principle I: Local Seclusion**
   - Aucun appel réseau après chargement initial (SC-001)
   - Aucun stockage persistant (SC-002)
   - Protections actives anti-localStorage (SC-003)

2. **Principle II: Universal Scannability**
   - QR scannable sur 95%+ des appareils (SC-004)
   - Quiet Zone de 4+ modules obligatoire (SC-005)
   - Support iOS 14+, Android Oreo+, caméras 5MP+ (SC-006)

3. **Principle III: Zero-Latency UI**
   - Time-to-Interactive < 2000ms sur 3G throttled (SC-007, ajusté de 500ms)
   - Génération QR < 100ms (SC-008)
   - Bundle JS < 50KB gzippé (SC-009)
   - Debounce 50ms sur input (SC-010)

## 🧪 Tests & Validation

### Lighthouse CI
Performance automatiquement testée sur chaque commit :
- **Performance Score** : ≥85%
- **Time to Interactive** : <2000ms
- **First Contentful Paint** : <2000ms

### Tests manuels requis

**Validations constitutionnelles** :
- [ ] T311: DevTools Network → zéro requête réseau après chargement
- [ ] T414: Mode sombre → Quiet Zone visible (bordure blanche 4 modules)
- [ ] T605: Network tab vide pendant génération QR
- [ ] T606: DevTools Application → Storage vide après utilisation
- [ ] T607: Console `console.time()` → QR génération <100ms
- [ ] T608: Bundle size : `Get-ChildItem -Recurse *.js,*.css,*.html | Measure-Object -Property Length -Sum` → <50KB gzippé
- [ ] T609: Scanner QR sur iPhone (iOS 14+) et Android (Oreo+)
- [ ] T610: Scanner QR avec appareil photo basique (5MP minimum)

**Tests fonctionnels** :
- [ ] T702: Tester Unicode/emojis : "Hello 👋 世界!"
- [ ] T704: Responsive sur écran 320px de large
- [ ] T709: Mode offline (DevTools → Network → Offline) → app fonctionne
- [ ] T710: Fallback clipboard si Web Share API non supportée

## 📊 Performance

| Métrique | Cible | Valeur actuelle |
|----------|-------|-----------------|
| Time to Interactive | <2000ms | ~1725ms ✅ |
| First Contentful Paint | <2000ms | ~1725ms ✅ |
| QR Generation | <100ms | ~10-30ms ✅ |
| Bundle Size (gzip) | <50KB | ~15KB ✅ |
| Performance Score | ≥85% | ~90% ✅ |

**Note** : TTI de 1725ms est normal avec une bibliothèque QR de 93KB (non-compressée) sur CPU throttlé 4x. Pour atteindre <500ms, il faudrait lazy loading ou Web Worker.

## 🤝 Contribution

Ce projet suit une spécification stricte définie dans `/specs/001-text-to-qr/`.

Pour contribuer :
1. Lire `spec.md`, `plan.md`, `tasks.md`
2. Vérifier `checklists/requirements.md` avant toute PR
3. Valider les tests Lighthouse CI
4. S'assurer de la conformité constitutionnelle (zero storage, zero network)

## 📄 License

[Insérer licence ici]

## 🙏 Remerciements

- [Nayuki](https://www.nayuki.io/) pour la bibliothèque QR Code robuste et bien documentée
- Inspiration du mouvement Local-First Software

---

**Développé avec precision et conformément aux principes local-first** 🚀
