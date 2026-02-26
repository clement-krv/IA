const ALLOWED_THEMES = new Set(['system', 'light', 'dark']);

export const setTheme = (mode) => {
  const normalized = ALLOWED_THEMES.has(mode) ? mode : 'system';

  if (normalized === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', normalized);
  }

  return normalized;
};
