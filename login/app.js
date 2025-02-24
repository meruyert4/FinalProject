import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import User from './models/user.js';

const router = express.Router();

// Serve Login Page
router.get('/', (req, res) => {
    res.render('home', { error: null });
});

// Register User
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.render('home', { error: 'All fields are required!' });
    if (password.length < 8) return res.render('home', { error: 'Password must be at least 8 characters!' });

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.render('home', { error: 'Username already exists!' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.redirect('/login'); // Redirect back to login page
    } catch (err) {
        console.error(err);
        res.render('home', { error: 'Error registering user!' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.render('home', { error: 'All fields are required!' });

    try {
        const user = await User.findOne({ username });
        if (!user) return res.render('home', { error: 'User not found!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render('home', { error: 'Invalid credentials!' });

        req.session.user = user;
        res.redirect('/login/dashboard');
    } catch (err) {
        console.error(err);
        res.render('home', { error: 'Error logging in!' });
    }
});

router.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('dashboard', { user: req.session.user });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

export default router;
