import { generateQR } from './qr-generator.js';
import { isShareSupported, saveImage, shareImage } from './share-handler.js';
import { setTheme } from './theme-manager.js';
import { preventPersistence } from './storage-manager.js';

const textInput = document.getElementById('text-input');
const qrContainer = document.getElementById('qr-container');
const counter = document.getElementById('counter');
const progressBar = document.getElementById('progress-bar');
const warning = document.getElementById('warning');
const saveButton = document.getElementById('save-button');
const shareButton = document.getElementById('share-button');
const clearButton = document.getElementById('clear-button');
const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');
const themeInputs = Array.from(document.querySelectorAll('input[name="theme"]'));
const eccInputs = Array.from(document.querySelectorAll('input[name="error-correction"]'));

const SOFT_LIMIT = 2000;
const HARD_LIMIT = 5000;
const isDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const shareSupported = isShareSupported();

const state = {
  errorCorrectionLevel: 'M',
};

preventPersistence({ dev: isDev });

const debounce = (fn, delay) => {
  let timerId;
  return (...args) => {
    if (timerId) {
      window.clearTimeout(timerId);
    }
    timerId = window.setTimeout(() => fn(...args), delay);
  };
};

const setSettingsOpen = (open) => {
  settingsPanel.hidden = !open;
  settingsButton.setAttribute('aria-expanded', String(open));
};

const updateCounter = (length) => {
  counter.textContent = `${length} / ${SOFT_LIMIT}`;
};

const updateProgressBar = (length) => {
  const percent = Math.min((length / SOFT_LIMIT) * 100, 100);
  progressBar.style.width = `${percent}%`;
};

const getWarningLevel = (length) => {
  if (length >= HARD_LIMIT) {
    return 'hard';
  }
  if (length > SOFT_LIMIT) {
    return 'soft';
  }
  return 'none';
};

const updateWarning = (length) => {
  const level = getWarningLevel(length);
  warning.classList.remove('is-soft', 'is-hard');

  if (level === 'none') {
    warning.hidden = true;
    warning.textContent = '';
    return;
  }

  warning.hidden = false;
  if (level === 'soft') {
    warning.classList.add('is-soft');
    warning.textContent = 'Scannability may degrade with long text.';
  } else {
    warning.classList.add('is-hard');
    warning.textContent = 'Hard limit reached. Consider reducing text.';
  }
};

const updateActionButtons = (hasContent) => {
  saveButton.disabled = !hasContent;
  saveButton.classList.toggle('is-disabled', !hasContent);

  const canShare = hasContent && shareSupported;
  shareButton.disabled = !canShare;
  shareButton.classList.toggle('is-disabled', !canShare);
  shareButton.title = shareSupported ? '' : 'Not supported';

  clearButton.disabled = !hasContent;
  clearButton.classList.toggle('is-disabled', !hasContent);
};

const renderQr = (text) => {
  if (!text) {
    qrContainer.innerHTML = '';
    updateActionButtons(false);
    return;
  }

  const svgMarkup = generateQR(text, {
    errorCorrectionLevel: state.errorCorrectionLevel,
    quietZone: 4,
    scale: 8,
  });
  qrContainer.innerHTML = svgMarkup;
  updateActionButtons(true);
};

const handleInput = debounce((event) => {
  const value = event.target.value;
  const length = value.length;
  updateCounter(length);
  updateProgressBar(length);
  updateWarning(length);
  renderQr(value);
}, 50);

const getQrSvg = () => qrContainer.querySelector('svg');

const clearAll = () => {
  const start = performance.now();
  textInput.value = '';
  qrContainer.innerHTML = '';
  updateCounter(0);
  updateProgressBar(0);
  updateWarning(0);
  updateActionButtons(false);
  textInput.focus();

  if (isDev) {
    console.assert(textInput.value === '', 'Clear All failed to reset input.');
    const elapsed = performance.now() - start;
    if (elapsed > 16) {
      console.warn(`Clear All took ${elapsed.toFixed(2)}ms.`);
    }
  }
};

const showSaveFeedback = () => {
  const originalText = saveButton.textContent;
  saveButton.textContent = '✓ Saved!';
  saveButton.classList.add('button--success');
  
  setTimeout(() => {
    saveButton.textContent = originalText;
    saveButton.classList.remove('button--success');
  }, 2000);
};

const checkBrowserCompatibility = () => {
  const isModernBrowser = (
    typeof Promise !== 'undefined' &&
    typeof fetch !== 'undefined' &&
    typeof qrcodegen !== 'undefined'
  );
  
  if (!isModernBrowser) {
    const message = 'This app requires a modern browser. Please update your browser.';
    warning.hidden = false;
    warning.classList.add('is-hard');
    warning.textContent = message;
    console.error(message);
  }
  
  return isModernBrowser;
};

textInput.addEventListener('input', handleInput);
saveButton.addEventListener('click', async () => {
  const svg = getQrSvg();
  if (!svg) {
    return;
  }
  await saveImage(svg);
  showSaveFeedback();
});

shareButton.addEventListener('click', async () => {
  const svg = getQrSvg();
  if (!svg || !shareSupported) {
    return;
  }

  try {
    await shareImage(svg);
  } catch (error) {
    if (isDev) {
      console.error(error);
    }
  }
});

clearButton.addEventListener('click', clearAll);

settingsButton.addEventListener('click', () => {
  setSettingsOpen(settingsPanel.hidden);
});

document.addEventListener('click', (event) => {
  if (settingsPanel.hidden) {
    return;
  }

  if (!settingsPanel.contains(event.target) && !settingsButton.contains(event.target)) {
    setSettingsOpen(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSettingsOpen(false);
  }
  
  // Keyboard shortcuts
  const isMod = event.ctrlKey || event.metaKey;
  
  if (isMod && event.key === 'k') {
    event.preventDefault();
    clearAll();
  }
  
  if (isMod && event.key === 's') {
    event.preventDefault();
    const svg = getQrSvg();
    if (svg) {
      saveImage(svg).then(() => showSaveFeedback());
    }
  }
});

themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) {
      setTheme(input.value);
    }
  });
});

eccInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!input.checked) {
      return;
    }
    state.errorCorrectionLevel = input.value;
    renderQr(textInput.value);
  });
});

setTheme('system');
setSettingsOpen(false);
updateCounter(0);
updateProgressBar(0);
updateWarning(0);
updateActionButtons(false);

// Check browser compatibility on startup
checkBrowserCompatibility();
