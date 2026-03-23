export const MODE_IDS = {
  NONE: 'none',
  BASE64_UTF8: 'base64_utf8',
  URL_PERCENT: 'url_percent',
  HEX_UTF8: 'hex_utf8',
  SHA256_HEX: 'sha256_hex',
  SHA384_HEX: 'sha384_hex',
  SHA512_HEX: 'sha512_hex',
};

export const TRANSFORMATION_MODES = Object.freeze([
  { id: MODE_IDS.NONE, category: 'none', label: 'Aucune transformation' },
  { id: MODE_IDS.BASE64_UTF8, category: 'encode', label: 'Base64 (UTF-8)' },
  { id: MODE_IDS.URL_PERCENT, category: 'encode', label: 'URL Percent-Encode' },
  { id: MODE_IDS.HEX_UTF8, category: 'encode', label: 'Hex (UTF-8 bytes)' },
  { id: MODE_IDS.SHA256_HEX, category: 'hash', label: 'SHA-256' },
  { id: MODE_IDS.SHA384_HEX, category: 'hash', label: 'SHA-384' },
  { id: MODE_IDS.SHA512_HEX, category: 'hash', label: 'SHA-512' },
]);

const MODE_MAP = new Map(TRANSFORMATION_MODES.map((mode) => [mode.id, mode]));

export const getModeById = (modeId) => MODE_MAP.get(modeId) || MODE_MAP.get(MODE_IDS.NONE);

export const isHashMode = (modeId) => getModeById(modeId).category === 'hash';

export const isEncodeMode = (modeId) => getModeById(modeId).category === 'encode';

export const validateModeId = (modeId) => (MODE_MAP.has(modeId) ? modeId : MODE_IDS.NONE);

export const getAvailableModes = ({ hashEnabled }) => {
  return TRANSFORMATION_MODES.map((mode) => {
    if (mode.category !== 'hash') {
      return { ...mode, enabled: true };
    }
    return { ...mode, enabled: Boolean(hashEnabled) };
  });
};
