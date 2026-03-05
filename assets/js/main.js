const generateBtn = document.getElementById('generate-btn');
const qrInput = document.getElementById('qr-input');
const qrCode = document.getElementById('qr-code');

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
});