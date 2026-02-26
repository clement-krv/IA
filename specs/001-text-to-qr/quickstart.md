# Quick Start: QR-Text Local-First

**Purpose**: Get the application running locally in < 5 minutes  
**Audience**: Developers setting up the project for the first time  
**Prerequisites**: Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)

---

## 🚀 Fastest Path (No Build Tools)

### 1. Clone & Serve

```bash
git clone <repository-url>
cd <repository-name>

# Option A: Python (if installed)
python3 -m http.server 8000

# Option B: Node.js (if installed)
npx http-server -p 8000

# Option C: PHP (if installed)
php -S localhost:8000
```

### 2. Open Browser

Navigate to **http://localhost:8000/**

**That's it.** The app runs without any build step.

---

## 📁 Project Structure

```
index.html           # Main HTML file
styles.css           # Styling (light/dark themes)
app.js               # Main application logic
qr-generator.js      # QR code generation (wraps Nayuki library)
theme-manager.js     # Dark/light mode management
storage-manager.js   # Anti-persistence safeguards
share-handler.js     # Save Image + Web Share API
lib/
  └── qrcodegen.js   # Nayuki QR Code generator library
```

---

## 🔧 Development Workflow

### Hot Reload (Optional)

Install a browser extension for live reload:
- **Chrome**: [Live Server](https://chrome.google.com/webstore/detail/live-server)
- **Firefox**: [Live Reload](https://addons.mozilla.org/firefox/addon/livereload-web-extension/)
- **VS Code**: Use [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### Testing Workflow

```bash
# Run Lighthouse performance test
npm install -g @lhci/cli
lhci autorun --config=lighthouserc.json

# Run Playwright E2E tests
npm install
npx playwright test

# Manual cross-device testing
# 1. Get local IP: ifconfig (Mac/Linux) or ipconfig (Windows)
# 2. Access from mobile: http://<your-ip>:8000/
# 3. Scan generated QR codes with phone camera
```

### Constitution Compliance Checks

```bash
# Verify zero network calls (run while app is open)
# Chrome DevTools → Network tab → Should show 0 requests after page load

# Verify no storage usage
# Chrome DevTools → Application → Storage → All should be empty

# Verify bundle size
du -sh *.html *.css *.js lib/qrcodegen.js | awk '{sum+=$1} END {print sum " KB"}'
# Should be < 50KB (before gzip)
```

---

## 🏗️ Production Build (Optional)

The app works perfectly without a build step, but you can minify for production:

```bash
# Install build tools (one-time)
npm install

# Build minified version
npm run build

# Output: dist/
#   ├── index.html (minified)
#   ├── styles.min.css
#   └── app.min.js (all JS bundled + minified)
```

Deploy `dist/` folder to any static hosting:
- GitHub Pages
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any web server (Apache, Nginx)

---

## 🧪 Testing Features

### Test Dark Mode

1. **System-level**:
   - Mac: System Preferences → General → Appearance → Dark
   - Windows: Settings → Personalization → Colors → Dark
   - Refresh app → Should auto-switch

2. **Manual override**:
   - Click gear icon (⚙️) in app
   - Select "Dark" or "Light"
   - Theme changes immediately

### Test Character Counter

1. Paste text into editor
2. Observe "X / 2000" counter
3. Watch progress bar fill
4. Exceed 2000 characters → Yellow warning appears
5. Exceed 5000 characters → Red warning appears

### Test QR Code Generation

1. Type text in editor
2. QR code appears instantly (< 100ms)
3. Scan with phone camera
4. Text should match exactly

### Test Save Image

1. Generate QR code
2. Click "Save Image" button
3. PNG file downloads (check Downloads folder)
4. Open PNG → QR code should be visible with white border (Quiet Zone)

### Test Web Share API (Mobile Only)

1. Open app on mobile device
2. Generate QR code
3. Click "Share" button
4. Native share menu appears
5. Send to WhatsApp/Email/etc.

**Note**: Desktop browsers (except Chrome/Edge) won't show Share button

### Test Clear All

1. Enter text
2. Click "Clear All"
3. Text and QR code disappear instantly
4. DevTools Console → No errors
5. DevTools Application Storage → Still empty (no traces)

---

## 🛠️ Troubleshooting

### Issue: "QR code not generating"

**Cause**: JavaScript module not loading  
**Fix**: Ensure you're serving via HTTP (not `file://`). Use `http-server`, `python -m http.server`, or similar.

### Issue: "Share button not appearing"

**Cause**: Browser doesn't support Web Share API  
**Expected**: Share button is hidden/disabled on unsupported browsers (Firefox desktop, older Chrome).  
**Test on mobile**: Chrome Android, Safari iOS

### Issue: "Lighthouse score < 95"

**Cause**: Network throttling or underpowered device  
**Fix**: 
1. Run Lighthouse in incognito mode (no extensions)
2. Ensure no other tabs are open
3. Check `lighthouserc.json` settings match production target

### Issue: "Bundle size > 50KB"

**Cause**: Unminified code or wrong library version  
**Fix**:
1. Check if `lib/qrcodegen.js` is the minified version
2. Run `npm run build` and measure `dist/` folder
3. Use `gzip -k dist/*.js && ls -lh dist/*.js.gz` to check gzipped size

---

## 📚 Next Steps

1. **Read the spec**: [spec.md](spec.md) — Understand user stories and requirements
2. **Review architecture**: [plan.md](plan.md) — See technical decisions and constitution compliance
3. **Study data model**: [data-model.md](data-model.md) — Understand state management
4. **Read research**: [research.md](research.md) — See why each technology was chosen

---

## 🚨 Critical Reminders

### DO NOT

- ❌ Add localStorage/sessionStorage (violates FR-008, constitution breach)
- ❌ Add analytics/tracking (violates FR-007, constitution breach)
- ❌ Make network calls during app usage (violates FR-006, constitution breach)
- ❌ Add heavy frameworks (React, Vue) — violates bundle size constraint
- ❌ Persist user settings — theme must reset on reload per constitution

### DO

- ✅ Keep bundle size under 50KB gzipped
- ✅ Ensure Time-to-Interactive < 500ms
- ✅ Test QR codes on real devices (iOS + Android)
- ✅ Verify zero network calls in DevTools
- ✅ Run Lighthouse CI on every PR

---

## 💡 Pro Tips

1. **Use DevTools Mobile Emulation**: Chrome DevTools → Toggle device toolbar (Cmd+Shift+M) to test responsive layout

2. **Test Offline Mode**: Chrome DevTools → Network tab → Offline → App should still work after reload

3. **Measure Performance**: Console → `performance.now()` before/after QR generation to verify < 100ms

4. **Character Limits**: Test with exactly 2000 and 5000 characters to see boundary conditions

5. **Cross-Browser**: Test on at least 3 browsers (Chrome, Firefox, Safari) before shipping

---

## 📞 Need Help?

- **Spec Questions**: See [spec.md](spec.md) — All requirements documented
- **Technical Decisions**: See [research.md](research.md) — All choices justified
- **Constitution Violations**: See [plan.md](plan.md) → Constitution Check section
- **Build Issues**: Check `package.json` scripts and `lighthouserc.json` config

**Happy coding! 🚀**
