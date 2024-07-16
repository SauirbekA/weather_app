

# WeatherWise Project

## Overview

WeatherWise is a web application that provides intelligent weather forecasts for various cities. The project is built using Django for the backend and plain HTML, CSS, and JavaScript for the frontend.

## Technologies Used.

- **Django**: The web framework used for the backend.
- **HTML**: For the structure of the web pages.
- **CSS**: For styling the web pages.
- **JavaScript**: For client-side interactions and fetching weather data from APIs.

## Running the Project

### Prerequisites

- Python 3.8 or higher
- Django 3.0 or higher

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SauirbekA/weather_app.git
   cd weather_app/weather_check
   ```

2. **Install the required packages:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Apply the migrations:**

   ```bash
   python manage.py migrate
   ```

4. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

5. **Access the application:**

   Open your web browser and go to `http://127.0.0.1:8000/`.

## Features

- **City Search**: Enter the name of a city to get the weather forecast.
- **Forecast Options**: Choose between a 24-hour or 10-day forecast.
- **Previous Searches**: View the last searched city and a history of previous searches.

## Static Files

The project uses static files for CSS and JavaScript. These are stored in the `static` directory:

- **CSS**: `static/base/css/styles.css`
- **JavaScript**: `static/js/scripts.js`
