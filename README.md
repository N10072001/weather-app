# Weather App 🌤️

A simple weather application built using **HTML**, **CSS**, and **JavaScript** that fetches real-time weather data for any city using a public API.

---

## Features

- Search weather by city name  
- Display current temperature, humidity, wind speed, and weather description  
- Dynamic weather icons  
- Loading indicator while fetching data  
- Error message for invalid city input  
- Responsive UI for desktop and mobile

---

## Technologies Used

- **HTML** — Structure of the app  
- **CSS** — Styling, layout, and animations  
- **JavaScript** — API calls, data handling, UI updates  
- **OpenWeatherMap API** (or whichever weather API you are using)

---

## Project Structure

weather-app/
├── index.html
├── style.css
├── script.js
└── README.md

---

## Setup & Usage

1. Clone the repository:  
   ```bash
   git clone https://github.com/N10072001/weather-app.git
   cd weather-app
Get an API key:

Sign up on OpenWeatherMap
 (or your chosen weather API)

Copy your API key

Add your API key in script.js where the API is called:
const apiKey = "YOUR_API_KEY_HERE";
Open index.html in your web browser to run the app.

How It Works

The user types a city name in the input field.

On submit, JavaScript sends a request to the weather API.

While waiting for the response, the app shows a loader.

Once data is returned, the app updates the UI with temperature, humidity, wind speed, and conditions.

If the city name is invalid or the API returns an error, a friendly error message appears.
Possible Improvements

Here are some ideas you could add later:

5-day or hourly weather forecast

Automatically detect user’s location using Geolocation API

Convert temperature between Celsius and Fahrenheit

Theme toggle: light / dark mode

Persist last searched cities in local storage

Contributing

If you’d like to contribute, feel free to:

Fork the repository

Create a new branch (feature/your-feature)

Make your changes

Open a Pull Request describing what you did
License

This project is open source — feel free to use it, modify it, or build on it.

Contact / Author

GitHub: N10072001

Project: weather-app
