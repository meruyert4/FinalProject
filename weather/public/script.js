document.getElementById('getWeatherBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    try {
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById('weatherResult').innerHTML = `<p style="color: red;">${data.error}</p>`;
            return;
        }

        document.getElementById('weatherResult').innerHTML = `
            <h2>Weather in ${city}</h2>
            <p>Temperature: ${data.weather.temperature}°C</p>
            <p>Feels Like: ${data.weather.feels_like}°C</p>
            <p>Description: ${data.weather.description}</p>
            <p>Humidity: ${data.weather.humidity}%</p>
            <p>Pressure: ${data.weather.pressure} hPa</p>
            <p>Wind Speed: ${data.weather.wind_speed} m/s</p>
            <p>Country Code: ${data.weather.country_code}</p>
            <p>Coordinates: (${data.weather.coordinates.lat}, ${data.weather.coordinates.lon})</p>
            <img src="https://openweathermap.org/img/wn/${data.weather.icon}@2x.png" alt="weather icon">
        `;

        // Change background based on temperature
        const temp = data.weather.temperature;
        document.body.style.backgroundImage = temp < 0 ? 'url(cold-weather.jpg)' : 'url("hot-weather.jpeg")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';

        // Update map location
        const { lat, lon } = data.weather.coordinates;
        map.setCenter({ lat, lng: lon });
        new google.maps.Marker({ position: { lat, lng: lon }, map, title: city });

    } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p style="color: red;">Error fetching data. Please try again later.</p>`;
        console.error('Error:', error);
    }
});
