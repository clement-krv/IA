# IA Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-25

## Active Technologies
- HTML5 + JavaScript ES modules (ES2020+) + Bibliothèque locale Nayuki (`lib/qrcodegen.js`), Web Crypto API (`crypto.subtle`) pour hash, APIs natives (`TextEncoder`, `btoa`) pour encodage (001-text-encode-hash)
- N/A (runtime only, aucune persistance) (001-text-encode-hash)

- HTML5 + JavaScript (ES2020+, async/await, modules) + QR code library (qrcode.js or qrcodejs2 - to be evaluated in research phase), no heavy frameworks (001-text-to-qr)

## Project Structure

```text
src/
tests/
```

## Commands

npm test; npm run lint

## Code Style

HTML5 + JavaScript (ES2020+, async/await, modules): Follow standard conventions

## Recent Changes
- 001-text-encode-hash: Added HTML5 + JavaScript ES modules (ES2020+) + Bibliothèque locale Nayuki (`lib/qrcodegen.js`), Web Crypto API (`crypto.subtle`) pour hash, APIs natives (`TextEncoder`, `btoa`) pour encodage

- 001-text-to-qr: Added HTML5 + JavaScript (ES2020+, async/await, modules) + QR code library (qrcode.js or qrcodejs2 - to be evaluated in research phase), no heavy frameworks

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
