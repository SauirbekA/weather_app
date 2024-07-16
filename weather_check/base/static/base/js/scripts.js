 const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const weatherContainer = document.getElementById('weather-container');
    const previousSearch = document.getElementById('previous-search');
    const citySuggestions = document.getElementById('city-suggestions');
    const forecastOptions = document.getElementById('forecast-options');
    const hourlyButton = document.getElementById('hourly-button');
    const dailyButton = document.getElementById('daily-button');
    const searchHistory = document.getElementById('search-history');

    let currentCity = '';
    let currentLat = '';
    let currentLon = '';

    // Check for previous serch
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if (lastSearchedCity) {
      previousSearch.innerHTML = `You previously searched for: <a href="#" onclick="searchCity('${lastSearchedCity}')">${lastSearchedCity}</a>`;
    }

    // City suggestions (simple)
    const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Moscow', 'Berlin', 'Rome', 'Madrid', 'Dubai'];
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      citySuggestions.appendChild(option);
    });

    searchButton.addEventListener('click', () => searchCity(cityInput.value));
    hourlyButton.addEventListener('click', () => getForecast('hourly'));
    dailyButton.addEventListener('click', () => getForecast('daily'));

    function searchCity(city) {
      if (!city) return;
      cityInput.value = city;
      getWeather();
    }

    async function getWeather() {
      const city = cityInput.value;
      if (!city) return;

      try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('City not found');
        }

        currentCity = city;
        currentLat = geoData.results[0].latitude;
        currentLon = geoData.results[0].longitude;

        getForecast('hourly');
        forecastOptions.style.display = 'block';
        localStorage.setItem('lastSearchedCity', city);
        updateSearchHistory(city);
      } catch (error) {
        weatherContainer.innerHTML = `<p>Error: ${error.message}</p>`;
      }
    }

    async function getForecast(type) {
      if (!currentCity) return;

      let url = `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

      if (type === 'daily') {
        url += `&forecast_days=10`;
      } else {
        url += `&forecast_days=1`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        displayForecast(data, type);
      } catch (error) {
        weatherContainer.innerHTML = `<p>Error: ${error.message}</p>`;
      }
    }

    function displayForecast(data, type) {
      let forecastHTML = `<h2>${type.charAt(0).toUpperCase() + type.slice(1)} Forecast for ${currentCity}</h2>`;
      forecastHTML += `<div id="${type}-forecast">`;

      if (type === 'hourly') {
        const currentHour = new Date().getHours();
        for (let i = currentHour; i < currentHour + 24; i++) {
          const index = i % 24;
          const date = new Date(data.hourly.time[index]);
          const hour = date.getHours();
          const temp = data.hourly.temperature_2m[index];
          const weatherCode = data.hourly.weathercode[index];

          forecastHTML += `
            <div class="forecast-box">
              <div>${hour}:00</div>
              <div class="temp">${temp}°C</div>
              <div class="icon">${getWeatherIcon(weatherCode)}</div>
            </div>
          `;
        }
      } else {
        for (let i = 0; i < 10; i++) {
          const date = new Date(data.daily.time[i]);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const maxTemp = data.daily.temperature_2m_max[i];
          const minTemp = data.daily.temperature_2m_min[i];
          const weatherCode = data.daily.weathercode[i];

          forecastHTML += `
            <div class="forecast-box">
              <div>${dayName}</div>
              <div class="temp">${maxTemp}°C / ${minTemp}°C</div>
              <div class="icon">${getWeatherIcon(weatherCode)}</div>
            </div>
          `;
        }
      }

      forecastHTML += '</div>';
      weatherContainer.innerHTML = forecastHTML;
    }

    function getWeatherIcon(code) {
      if (code < 3) return '☀️';
      if (code < 50) return '☁️';
      if (code < 70) return '🌧️';
      if (code < 80) return '❄️';
      return '⛈️';
    }

    function updateSearchHistory(city) {
      let history = JSON.parse(localStorage.getItem('searchHistory')) || {};
      history[city] = (history[city] || 0) + 1;
      localStorage.setItem('searchHistory', JSON.stringify(history));
      displaySearchHistory();
    }

    function displaySearchHistory() {
      const history = JSON.parse(localStorage.getItem('searchHistory')) || {};
      let historyHTML = '<h3>Search History</h3><ul>';
      for (let city in history) {
        historyHTML += `<li>${city}: ${history[city]} time(s)</li>`;
      }
      historyHTML += '</ul>';
      searchHistory.innerHTML = historyHTML;
    }

    displaySearchHistory();

    // Simple test function
    function runTests() {
      console.log('Running tests...');

      // Test getWeatherIcon function
      console.assert(getWeatherIcon(0) === '☀️', 'Clear weather icon test failed');
      console.assert(getWeatherIcon(3) === '☁️', 'Cloudy weather icon test failed');
      console.assert(getWeatherIcon(60) === '🌧️', 'Rainy weather icon test failed');
      console.assert(getWeatherIcon(75) === '❄️', 'Snowy weather icon test failed');
      console.assert(getWeatherIcon(95) === '⛈️', 'Thunderstorm icon test failed');


      updateSearchHistory('TestCity');
      const history = JSON.parse(localStorage.getItem('searchHistory')) || {};
      console.assert(history['TestCity'] > 0, 'Search history update test failed');

      console.log('Tests completed.');
    }

    runTests();