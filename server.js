const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const blogRouter = require('./blogplatform/app');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/test';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Mount Blog Routes
app.use('/blog', blogRouter);

// Serve Home Page
app.get('/', (req, res) => {
    res.redirect('/blog');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
