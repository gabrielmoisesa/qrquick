// Document elements
const generateBtn = document.getElementById('generate-btn');
const qrInput = document.getElementById('qr-input');
const qrCode = document.getElementById('qr-code');
const qrActions = document.getElementById('qr-actions');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const themeToggle = document.getElementById('theme-toggle');

// Detect language - falls back to 'en' if unsupported
const userLang = navigator.language.slice(0, 2); // e.g. 'pt', 'en', 'es'
// const userLang = 'pt'; // For testing translation, uncomment this line, set desired language code and comment out the line above
const lang = translations[userLang] ? userLang : 'en';
const t = translations[lang];

document.documentElement.lang = lang;

document.querySelectorAll('[data-i18n]').forEach((el) => {
  el.textContent = t[el.dataset.i18n];
});

document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
  el.placeholder = t[el.dataset.i18nPlaceholder];
});

// Load saved theme or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply theme on page load
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark');
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
} else {
  themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

qrInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    generateBtn.click();
  }
});

generateBtn.addEventListener('click', () => {
  const text = qrInput.value.trim();

  if (!text) {
    alert(t.alertEmpty);
    return;
  }

  // Clear previous QR code
  qrCode.innerHTML = '';

  new QRCode(qrCode, {
    text: text,
    width: 320,
    height: 320,
  });
});

function getQRCanvasWithPadding(sourceCanvas) {
  const padding = 20;
  const size = sourceCanvas.width + padding * 2;

  const paddedCanvas = document.createElement('canvas');
  paddedCanvas.width = size;
  paddedCanvas.height = size;

  const ctx = paddedCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(sourceCanvas, padding, padding);

  return paddedCanvas;
}

downloadBtn.addEventListener('click', () => {
  const qrCanvas = qrCode.querySelector('canvas');
  const qrImage = qrCode.querySelector('img');

  let dataUrl;

  if (qrCanvas) {
    dataUrl = getQRCanvasWithPadding(qrCanvas).toDataURL('image/png');
  } else if (qrImage) {
    dataUrl = getQRCanvasWithPadding(qrImage).toDataURL('image/png');
  } else {
    alert(t.alertNoDownload);
    return;
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'qrquick.png';
  link.click();
});

shareBtn.addEventListener('click', async () => {
  const qrCanvas = qrCode.querySelector('canvas');
  const qrImage = qrCode.querySelector('img');

  let dataUrl;

  if (qrCanvas) {
    dataUrl = getQRCanvasWithPadding(qrCanvas).toDataURL('image/png');
  } else if (qrImage) {
    dataUrl = getQRCanvasWithPadding(qrImage).toDataURL('image/png');
  } else {
    alert(t.alertNoShare);
    return;
  }

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], 'qrquick.png', { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'QRQuick',
        text: 'Check out this QR code I generated with QRQuick!',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
    // Fallback: copy image to clipboard
  } else if (navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      alert(t.alertCopied);
    } catch (error) {
      console.error('Clipboard error:', error);
      alert(t.alertCopyFail);
    }
  } else {
    alert(t.alertShareFail);
  }
});
