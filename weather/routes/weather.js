import express from 'express';
import axios from 'axios';

const router = express.Router();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

router.get('/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: "City is required." });
    }

    try {
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        const weatherData = weatherResponse.data;

        res.json({
            weather: {
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon,
                coordinates: { lat: weatherData.coord.lat, lon: weatherData.coord.lon },
                feels_like: weatherData.main.feels_like,
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                wind_speed: weatherData.wind.speed,
                country_code: weatherData.sys.country,
            },
        });
    } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);

        if (error.response?.status === 401) {
            return res.status(401).json({ error: "Invalid API key. Please check your OpenWeather API key." });
        }
        
        if (error.response?.status === 404) {
            return res.status(404).json({ error: "City not found. Please enter a valid city name." });
        }

        res.status(500).json({ error: "Error fetching data. Please try again later." });
    }
});

export default router;
