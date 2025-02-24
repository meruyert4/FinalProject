const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require("path");

const app = express();

mongoose.connect('mongodb://localhost:27017/test')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(" MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('users', userSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'web'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'web')));
app.use(session({
    secret: '4Imp3xlavgXmbWCIXl9dCEomHW4LyGSBCXfuOrF',
    resave: false,
    saveUninitialized: true,
}));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (password.length < 8) return res.send('Password must be at least 8 characters long');

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.send('Username already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.redirect('/login.html');
    } catch (err) {
        console.error(err);
        res.send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.send('Invalid credentials');

        req.session.user = user;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.send('Error logging in');
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login.html');

    res.render('profile', {
        username: req.session.user.username,
        email: req.session.user.username + '@mail.com'
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login.html'));
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'web/home.html')));

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
