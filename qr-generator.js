const resolveEcc = (level) => {
  if (!window.qrcodegen || !window.qrcodegen.QrCode) {
    throw new Error('QR library not loaded. Ensure lib/qrcodegen.js is present.');
  }

  const ecc = window.qrcodegen.QrCode.Ecc;
  const normalized = String(level || 'M').toUpperCase();
  switch (normalized) {
    case 'L':
      return ecc.LOW;
    case 'Q':
      return ecc.QUARTILE;
    case 'H':
      return ecc.HIGH;
    case 'M':
    default:
      return ecc.MEDIUM;
  }
};

const buildSvg = (qr, quietZone) => {
  const size = qr.size;
  const totalSize = size + quietZone * 2;
  let path = '';

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (qr.getModule(x, y)) {
        path += `M${x},${y}h1v1h-1z`;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${-quietZone} ${-quietZone} ${totalSize} ${totalSize}" shape-rendering="crispEdges" role="img" aria-label="QR code">
      <rect width="100%" height="100%" fill="#ffffff" />
      <path d="${path}" fill="#000000" />
    </svg>
  `;
};

export const generateQR = (text, options = {}) => {
  const quietZone = Number.isFinite(options.quietZone) ? options.quietZone : 4;
  const ecc = resolveEcc(options.errorCorrectionLevel || 'M');
  const qr = window.qrcodegen.QrCode.encodeText(text, ecc);
  return buildSvg(qr, quietZone);
};
