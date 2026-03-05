const generateBtn = document.getElementById('generate-btn');
const qrInput = document.getElementById('qr-input');
const qrCode = document.getElementById('qr-code');
const qrActions = document.getElementById('qr-actions');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');

generateBtn.addEventListener('click', () => {
    const text = qrInput.value.trim();

    if (!text) {
        alert('Please enter some text or URL to generate a QR code.');
        return;
    }

    // Clear previous QR code
    qrCode.innerHTML = '';

    new QRCode(qrCode, {
        text: text,
        width: 256,
        height: 256,
    });

    // Show the actions (download/share) after generating the QR code
    qrActions.style.display = 'block';
});

downloadBtn.addEventListener('click', () => {
    const qrCanvas = qrCode.querySelector('canvas');
    const qrImage = qrCode.querySelector('img');

    let dataUrl;

    if (qrCanvas) {
        dataUrl = qrCanvas.toDataURL('image/png');
    } else if (qrImage) {
        dataUrl = qrImage.src;
    } else {
        alert('No QR code to download. Please generate one first.');
        return;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrquick.png';
    link.click();
});