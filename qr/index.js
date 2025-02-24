import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import qr from 'qr-image';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve HTML frontend

// Generate QR Code
app.post('/generate', (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    const qrCode = qr.imageSync(url, { type: 'png' });
    const qrFilePath = './public/qr-code.png';

    fs.writeFileSync(qrFilePath, qrCode);

    res.redirect('/qr');
});

// Show QR Page
app.get('/qr', (req, res) => {
    res.send(`
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>QR Code</title>
            <style>
                body { text-align: center; font-family: Arial, sans-serif; padding: 20px; }
                img { max-width: 300px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1>Your QR Code:</h1>
            <img src="/qr-code.png" alt="QR Code">
            <br>
            <a href="/">Generate Another QR Code</a>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
