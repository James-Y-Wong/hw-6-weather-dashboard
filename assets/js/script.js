var searchFormEl = document.querySelector("#search-form");
var searchFormCityInputEl = document.querySelector("#search-form-city-input");
var weatherDayCityEl = document.querySelector("#weather-day-city");
var weatherDayTempEl = document.querySelector("#weather-day-temp");
var weatherDayWindEl = document.querySelector("#weather-day-wind");
var weatherDayHumidityEl = document.querySelector("#weather-day-humidity");
var weatherDayUvIndexEl = document.querySelector("#weather-day-index");
var forecastContainerEl = document.querySelector("#forecast-container");
var weatherDayIconEl = document.querySelector("#weather-day-icon");
var buttonContainerEl = document.querySelector("#button-container");
var currentDate = document.querySelector("#current-date");

//variables for fetching API easier
var baseUrl = "http://api.openweathermap.org/";
var apiKey = "0bd0db4911219e35081c10de764bbd42";

// function populates 5 days forecast card 
function populate5day(data) {
    forecastContainerEl.innerHTML = "";
    data.forEach(function(day, index) {
        if (index === 0 || index > 5) {
            return;
        }
        var dt = day.dt;
        var date = moment.unix(dt).format("L");
        var temp = day.temp.day;
        var windSpeed = day.wind_speed;
        var humidity = day.humidity;
        var icon = day.weather[0].icon;
        var div = document.createElement("div");
        // renders HTML for each day of forecast
        div.innerHTML = ` 
            <div class="card-future card">
                <div class="future-body">             
                    <h5 class="card-title" id="date1">${date}</h5>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" />
                    <dl>
                        <dt>Temp:</dt>
                        <dd>${temp} \u00B0F</dd>
                        <dt>Wind:</dt>
                        <dd>${windSpeed} MPH</dd>
                        <dt>Humidity</dt>
                        <dd>${humidity} %</dd>
                    </dl>
                </div>
            </div>
        `
        // appends to html
        forecastContainerEl.append(div);

    })
        
    
}
// fetch api from open weather app
function getCityDayWeather(city) {
    var url = `${baseUrl}geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if(!data.length) {
            window.alert("No city matches!");
            return;
        }

        storeCityLocation(city);
        populateButton();

        var cityObject = data[0];
        var lat = cityObject.lat;
        var lon = cityObject.lon;

        var currentWeatherUrl = `${baseUrl}data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

        fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var current = data.current;
            var date = current.dt;
            var temp = current.temp;
            var windSpeed = current.wind_speed;
            var humidity = current.humidity;
            var uvIndex = current.uvi;
            var icon = current.weather[0].icon

            currentDate.textContent = moment.unix(date).format("L");
            weatherDayCityEl.textContent = city;
            weatherDayTempEl.textContent = temp + " \u00B0F";
            weatherDayWindEl.textContent = windSpeed + " MPH";
            weatherDayHumidityEl.textContent = humidity + " %";
            weatherDayUvIndexEl.textContent = uvIndex;
            if (uvIndex < 3) {
                weatherDayUvIndexEl.classList.add("favorable");
            } else if (uvIndex < 7) {
                weatherDayUvIndexEl.classList.add("moderate");
            } else {
                weatherDayUvIndexEl.classList.add("severe");
            }

            weatherDayIconEl.src = `https://openweathermap.org/img/wn/${icon}.png`;

            populate5day(data.daily);

        });
    });
}


function populateButton() {
    buttonContainerEl.innerHTML = "";
    var cities = window.localStorage.getItem("cities");
    if (cities) {
        cities = JSON.parse(cities)
    } else {
        cities = []
    }

    cities.forEach(function(city) {
        var button = document.createElement("button");

        button.classList = "btn btn-secondary";
        button.textContent = city;
        button.setAttribute("data-city", city);
        buttonContainerEl.appendChild(button);
    })


}

function storeCityLocation(city) {
    var cities = window.localStorage.getItem("cities");
    if (cities) {
        cities = JSON.parse(cities)
    } else {
        cities = []
    }

    if (cities.includes(city)) {
        return;
    } else {
        cities.push(city);
    }
    
    window.localStorage.setItem("cities", JSON.stringify(cities));
}

function handleFormSubmit(event) {
    event.preventDefault();
    var city = searchFormCityInputEl.value;
    getCityDayWeather(city);
}

function handleButtonClick(event) {
    var target = event.target;
    var city = target.getAttribute("data-city");
    getCityDayWeather(city);
}

function addEventListeners() {
    searchFormEl.addEventListener("submit", handleFormSubmit);
    buttonContainerEl.addEventListener("click", handleButtonClick);
}

function init() {
    addEventListeners()
    populateButton();
}

init();