const API_KEY = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}';

document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    getWeatherData(city);
});

document.querySelectorAll('.city-btn').forEach(button => {
    button.addEventListener('click', () => {
        const city = button.getAttribute('data-city');
        getWeatherData(city);
    });
});

function getWeatherData(city) {
    const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;

            return fetch(weatherUrl);
        })
        .then(response => response.json())
        .then(data => {
            displayWeatherData(city, data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeatherData(city, data) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    const currentWeather = data.list[0];
    const forecast = data.list.slice(1, 6);

    const currentWeatherHtml = `
        <div class="weather">
            <h2>${city} (${new Date(currentWeather.dt_txt).toLocaleDateString()})</h2>
            <p>Temp: ${currentWeather.main.temp} °F</p>
            <p>Wind: ${currentWeather.wind.speed} MPH</p>
            <p>Humidity: ${currentWeather.main.humidity} %</p>
        </div>
    `;

    const forecastHtml = forecast.map(day => `
        <div class="day">
            <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
            <p>Temp: ${day.main.temp} °F</p>
            <p>Wind: ${day.wind.speed} MPH</p>
            <p>Humidity: ${day.main.humidity} %</p>
        </div>
    `).join('');

    weatherContainer.innerHTML = currentWeatherHtml + `
        <div class="forecast">
            <h3>5-Day Forecast:</h3>
            ${forecastHtml}
        </div>
    `;
}
