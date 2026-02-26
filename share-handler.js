const MIN_PNG_SIZE = 512;

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load SVG image.'));
    img.src = url;
  });

const svgToPngBlob = async (svgElement) => {
  const serializer = new XMLSerializer();
  const svgMarkup = serializer.serializeToString(svgElement);
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    const size = Math.max(MIN_PNG_SIZE, Math.round(img.width || MIN_PNG_SIZE));
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);

    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('PNG generation failed.'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(url);
  }
};

export const isShareSupported = () => {
  if (!navigator.share || !navigator.canShare) {
    return false;
  }

  try {
    const testFile = new File([new Blob(['test'])], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [testFile] });
  } catch (error) {
    return false;
  }
};

export const saveImage = async (svgElement) => {
  const blob = await svgToPngBlob(svgElement);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qr-code.png';
  link.click();
  URL.revokeObjectURL(url);
};

export const shareImage = async (svgElement) => {
  if (!isShareSupported()) {
    throw new Error('Web Share API not supported.');
  }

  const blob = await svgToPngBlob(svgElement);
  const file = new File([blob], 'qr-code.png', { type: 'image/png' });
  await navigator.share({
    files: [file],
    title: 'QR Code',
    text: 'Scan this QR code to get the text.',
  });
};
