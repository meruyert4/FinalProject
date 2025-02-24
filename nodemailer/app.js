import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';


dotenv.config();
const router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.render('nodeHome', { error: null });
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: message
        });

        res.json({ message: '✅ Email sent successfully!', response: info.response });
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ message: '❌ Failed to send email.' });
    }
});

export default router;
