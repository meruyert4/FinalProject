import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import User from './models/user.js';  // Ensure this file exists

const router = express.Router();

// Middleware for parsing request body
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(session({
    secret: '4Imp3xlavgXmbWCIXl9dCEomHW4LyGSBCXfuOrF',
    resave: false,
    saveUninitialized: true,
}));

// Connect to MongoDB (Ensure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// **REGISTER ROUTE**
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: 'Username and Password are required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters long' });

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// **LOGIN ROUTE**
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: 'Username and Password are required' });

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        req.session.user = user;
        res.status(200).json({ message: 'Login successful', user: { username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// **LOGOUT ROUTE**
router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ message: 'Logged out successfully' }));
});

export default router;
