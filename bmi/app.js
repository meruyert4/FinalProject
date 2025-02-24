import express from 'express';
import path from 'path';

const router = express.Router();

// ✅ Serve Static Files Correctly
router.use('/public', express.static(path.join(process.cwd(), 'bmi', 'public')));

// ✅ Serve index.html correctly
router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'bmi', 'views', 'index.html'));
});

// ✅ BMI Calculation Route
router.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.sendFile(path.join(process.cwd(), 'bmi', 'views', 'result_invalid.html'));
    }

    const bmi = weight / ((height / 100) ** 2);
    let category;

    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi < 24.9) {
        category = 'Normal weight';
    } else if (bmi < 29.9) {
        category = 'Overweight';
    } else {
        category = 'Obese';
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Result</title>
            <link rel="stylesheet" href="/bmi/public/result_style.css">
        </head>
        <body>
            <div class="container">
                <h1>Your BMI Result</h1>
                <p>Your BMI is: <strong>${bmi.toFixed(2)}</strong></p>
                <p>Category: <strong>${category}</strong></p>
                <a href="/bmi">Go Back</a>
            </div>
        </body>
        </html>
    `);
});

export default router;
