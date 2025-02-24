import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import qr from 'qr-image';
import path from 'path';

const router = express.Router();
router.use(bodyParser.json());

// Serve the QR code generator page
router.get('/', (req, res) => {
    res.render('homeQr', { error: null, qrPath: null });
});

// Generate QR Code
router.post('/generate', (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'qr', 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate QR Code and save it
    const qrCode = qr.imageSync(url, { type: 'png' });
    const qrFileName = `qr-${Date.now()}.png`;
    const qrFilePath = path.join(publicDir, qrFileName);
    fs.writeFileSync(qrFilePath, qrCode);

    // Redirect to display the QR code
    res.redirect(`/qr/display?qr=${qrFileName}`);
});

// Display generated QR code
router.get('/display', (req, res) => {
    const qrFileName = req.query.qr;
    if (!qrFileName) {
        return res.redirect('/qr');
    }

    res.render('displayQr', { qrPath: `/qr/public/${qrFileName}` });
});

export default router;
