import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import blogRouter from './blogplatform/app.js';
import bmiRouter from './bmi/app.js';
import loginRouter from './login/app.js';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/bmi/public', express.static(path.join(process.cwd(), 'bmi', 'public')));
app.use('/login/public', express.static(path.join(process.cwd(), 'login', 'public')));


app.set('view engine', 'ejs');
app.set('views', [
    path.join(process.cwd(), 'bmi', 'views'),
    path.join(process.cwd(), 'login', 'views'),
    path.join(process.cwd(), 'blogplatform', 'views')
]);


app.use(session({
    secret: 'kjendjfhcbjhwbLBWEFBuwehnij;nEWJNIJNF',
    resave: false,
    saveUninitialized: true
}));

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/test';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Mount Routes
app.use('/blog', blogRouter);
app.use('/bmi', bmiRouter);
app.use('/login', loginRouter);


// Serve Home Page
app.get('/', (req, res) => {
    res.redirect('/blog');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
