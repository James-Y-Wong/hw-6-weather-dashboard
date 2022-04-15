var searchFormEl = document.querySelector("#search-form");
var searchFormCityInputEl = document.querySelector("#search-form-city-input");
var weatherDayCityEl = document.querySelector("#weather-day-city");
var weatherDayTempEl = document.querySelector("#weather-day-temp");
var weatherDayWindEl = document.querySelector("#weather-day-wind");
var weatherDayHumidityEl = document.querySelector("#weather-day-humidity");
var weatherDayUvIndexEl = document.querySelector("#weather-day-index");
var forecastContainerEl = document.querySelector("#forecast-container");
var weatherDayIconEl = document.querySelector("#weather-day-icon");

var baseUrl = "http://api.openweathermap.org/";
var apiKey = "0bd0db4911219e35081c10de764bbd42";


function populate5day(data) {
    data.forEach(function(day, index) {
        if (index > 4) {
            return;
        }
        var temp = day.temp.day;
        var windSpeed = day.wind_speed;
        var humidity = day.humidity;
        var icon = day.weather[0].icon;
        var div = document.createElement("div");
        // div.classList = "future-body"
        div.innerHTML = ` 
            <div class="card-future card">
                <div class="future-body">             
                    <h5 class="card-title" id="date1">4/7/2022</h5>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" />
                    <dl>
                        <dt>Temp:</dt>
                        <dd>${temp}</dd>
                        <dt>Wind:</dt>
                        <dd>${windSpeed} MPH</dd>
                        <dt>Humidity</dt>
                        <dd>${humidity} %</dd>
                    </dl>
                </div>
            </div>
        `
        forecastContainerEl.append(div);

    })
        
    
}

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
            var icon = current.weather[0].icon

            weatherDayCityEl.textContent = city;
            weatherDayTempEl.textContent = temp;
            weatherDayWindEl.textContent = windSpeed + " MPH";
            weatherDayHumidityEl.textContent = humidity + " %";
            weatherDayUvIndexEl.textContent = uvIndex;
            weatherDayIconEl.src = `https://openweathermap.org/img/wn/${icon}.png`;

            populate5day(data.daily);

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