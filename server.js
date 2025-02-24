import express from 'express';
import path from 'path';
import session from 'express-session';
import mongoose from 'mongoose';
import blogRouter from './blogplatform/app.js';
import bmiRouter from './bmi/app.js';
import loginRouter from './login/app.js';

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: '4Imp3xlavgXmbWCIXl9dCEomHW4LyGSBCXfuOrF',
    resave: false,
    saveUninitialized: true,
}));

// Serve Static Files
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/blog', blogRouter);
app.use('/bmi', bmiRouter);
app.use('/login', loginRouter);
app.use('/nodemailer', express.static(path.join(process.cwd(), 'nodemailer', 'public')));
app.use('/qr', express.static(path.join(process.cwd(), 'qr', 'public')));
app.use('/weather', express.static(path.join(process.cwd(), 'weather', 'public')));

// Serve login assets
app.use('/login-assets', express.static(path.join(process.cwd(), 'login', 'web')));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
