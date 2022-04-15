var searchFormEl = document.querySelector("#search-form");
var searchFormCityInputEl = document.querySelector("#search-form-city-input");
var weatherDayCityEl = document.querySelector("#weather-day-city");
var weatherDayTempEl = document.querySelector("#weather-day-temp");
var weatherDayWindEl = document.querySelector("#weather-day-wind");
var weatherDayHumidityEl = document.querySelector("#weather-day-humidity");
var weatherDayUvIndexEl = document.querySelector("#weather-day-index");

var baseUrl = "http://api.openweathermap.org/";
var apiKey = "0bd0db4911219e35081c10de764bbd42";

function getCityDayWeather(city) {
    var url = `${baseUrl}geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var cityObject = data[0];
        var lat = cityObject.lat;
        var lon = cityObject.lon;

        var currentWeatherUrl = `${baseUrl}data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var current = data.current;
            var temp = current.temp;
            var windSpeed = current.wind_speed;
            var humidity = current.humidity;
            var uvIndex = current.uvi;

            weatherDayCityEl.textContent = city;
            weatherDayTempEl.textContent = temp;
            weatherDayWindEl.textContent = windSpeed;
            weatherDayHumidityEl.textContent = humidity;
            weatherDayUvIndexEl.textContent = uvIndex;

        });
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    var city = searchFormCityInputEl.value;
    getCityDayWeather(city);
}

function addEventListeners() {
    searchFormEl.addEventListener("submit", handleFormSubmit);
}

function init() {
    addEventListeners()
}

init();