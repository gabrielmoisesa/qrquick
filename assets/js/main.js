const generateBtn = document.getElementById('generate-btn');
const qrInput = document.getElementById('qr-input');
const qrCode = document.getElementById('qr-code');
const qrActions = document.getElementById('qr-actions');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');

qrInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        generateBtn.click();
    }
});

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
        width: 320,
        height: 320,
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

shareBtn.addEventListener('click', async () => {
    const qrCanvas = qrCode.querySelector('canvas');
    const qrImage = qrCode.querySelector('img');

    let dataUrl;

    if (qrCanvas) {
        dataUrl = qrCanvas.toDataURL('image/png');
    } else if (qrImage) {
        dataUrl = qrImage.src;
    } else {
        alert('No QR code to share. Please generate one first.');
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
                new ClipboardItem({ 'image/png': blob })
            ]);
            alert('QR code image copied to clipboard!');
        } catch (error) {
            console.error('Clipboard error:', error);
            alert('Could not copy. Try downloading instead.');
        }
    } else {
        alert('Sharing not supported. Please use the Download button.');
    }
});