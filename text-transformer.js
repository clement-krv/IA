import { MODE_IDS, isHashMode, validateModeId } from './transformation-modes.js';

const encoder = new TextEncoder();

const bytesToHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

const utf8ToBase64 = (text) => {
  const bytes = encoder.encode(text);
  let binary = '';
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return window.btoa(binary);
};

const utf8ToHex = (text) => bytesToHex(encoder.encode(text));

const hashToHex = async (algorithm, text) => {
  const data = encoder.encode(text);
  const digest = await window.crypto.subtle.digest(algorithm, data);
  return bytesToHex(new Uint8Array(digest));
};

export const canUseHashTransforms = () => {
  return Boolean(window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function');
};

export const applyTransformation = async (text, modeId) => {
  const safeModeId = validateModeId(modeId);

  switch (safeModeId) {
    case MODE_IDS.NONE:
      return text;
    case MODE_IDS.BASE64_UTF8:
      return utf8ToBase64(text);
    case MODE_IDS.URL_PERCENT:
      return encodeURIComponent(text);
    case MODE_IDS.HEX_UTF8:
      return utf8ToHex(text);
    case MODE_IDS.SHA256_HEX:
      return hashToHex('SHA-256', text);
    case MODE_IDS.SHA384_HEX:
      return hashToHex('SHA-384', text);
    case MODE_IDS.SHA512_HEX:
      return hashToHex('SHA-512', text);
    default:
      return text;
  }
};

export const isModeSupported = (modeId) => {
  if (!isHashMode(modeId)) {
    return true;
  }

  return canUseHashTransforms();
};
