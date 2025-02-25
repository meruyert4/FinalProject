import express from 'express';
import weatherRouter from './routes/weather.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/weather', weatherRouter);

export default app;
