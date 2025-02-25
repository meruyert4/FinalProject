import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import blogRouter from './blogplatform/app.js';
import bmiRouter from './bmi/app.js';
import loginRouter from './login/app.js';
import mailRouter from './nodemailer/app.js';
import qrRouter from './qr/app.js';
import session from 'express-session';
import weatherRouter from './weather/routes/weather.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/bmi/public', express.static(path.join(process.cwd(), 'bmi', 'public')));
app.use('/login/public', express.static(path.join(process.cwd(), 'login', 'public')));

app.set('view engine', 'ejs');
app.set('views', [
    path.join(process.cwd(), 'bmi', 'views'),
    path.join(process.cwd(), 'login', 'views'),
    path.join(process.cwd(), 'blogplatform', 'views'),
    path.join(process.cwd(), 'nodemailer', 'views'),
    path.join(process.cwd(), 'qr', 'views'),
    path.join(process.cwd(), 'weather', 'views')
]);

app.use(session({
    secret: 'kjendjfhcbjhwbLBWEFBuwehnij;nEWJNIJNF',
    resave: false,
    saveUninitialized: false
}));

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Database connection
const MONGO_URI = 'mongodb://localhost:27017/test';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use('/qr/public', express.static(path.join(process.cwd(), 'qr', 'public')));
app.use('/weather/public', express.static(path.join(process.cwd(), 'weather', 'public')));


// Routes
app.use('/login', loginRouter);
app.use('/blog', isAuthenticated, blogRouter);
app.use('/bmi', isAuthenticated, bmiRouter);
app.use('/mail', isAuthenticated, mailRouter);
app.use('/qr', isAuthenticated, qrRouter);
app.use('/weather', isAuthenticated, weatherRouter);

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/blog');
    } else {
        res.redirect('/login');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
