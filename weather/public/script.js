document.getElementById('getWeatherBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    try {
        const response = await fetch(`/weather/data?city=${city}`);
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

        // Initialize map
        initMap(data.weather.coordinates.lat, data.weather.coordinates.lon);

    } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p style="color: red;">Error fetching data. Please try again later.</p>`;
        console.error('Error:', error);
    }
});

// Initialize Google Map
function initMap(lat = 48.8566, lon = 2.3522) {
    const location = { lat, lng: lon };
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: location
    });
    new google.maps.Marker({
        position: location,
        map: map
    });
}
