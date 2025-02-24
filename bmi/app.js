import express from 'express';
import path from 'path';

const router = express.Router();

// Serve BMI home page
router.get('/', (req, res) => {
    res.render('index');
});

// BMI Calculation Route
router.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.render('result_invalid');
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

    res.render('result', { bmi: bmi.toFixed(2), category });
});

export default router;
