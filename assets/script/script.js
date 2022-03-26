console.log("This script has loaded");

//API key

const APIKey = "6b826d4c34586e17f4f669d088a91aed";

let searchFormEl = document.getElementById("search-form");

let savedData = {};

let weatherForecastData = {};

// var cityInput = "sydney"

// let latLonUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&appid=" + APIKey;

let cityInputVal = document.getElementById("city-search-input");

let todayForecast = document.getElementById("today-forecast");
let forecastDetails = document.getElementById("forecast-details");
let futureForecast = document.getElementById("future-forecast");

let searchBtn = document.getElementById("search-btn");

let previousSearches = document.getElementById("previous-searches");

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

//prevent form from refreshing page and prevent user from not entering a city

function formSubmitHandler(event) {
    event.preventDefault();

    cityInputVal = document.getElementById("city-search-input").value;

    if (!cityInputVal) {
        alert("Please enter a city");
        return;
    }

    console.log(cityInputVal)

    // searchHistory();

    getApi();

}

//get the API

function getApi() {

    //API request based on city name to obtain the latitude and longitude

    console.log(cityInputVal)

    let queryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInputVal + "&appid=" + APIKey;

    fetch(queryUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
            }
            return response.json();
        })

        //save the data from the latitude and longitude API request
        .then(function (data) {
            console.log(data)

            savedData = data;

            //API request based on latitude and longitude from our first API request

            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + savedData[0].lat + "&lon=" + savedData[0].lon + "&units=metric&exclude=hourly,minutely&appid=" + APIKey)

        })
        .then(function (response) {
            if (response.ok) {
                console.log(response);
            }
            return response.json();
        })
        .then(function (data) {

            weatherForecastData = data

            if (!Object.keys(weatherForecastData).length) {
                console.log("No weather")
            } else {
                // todayForecast = ""

                printWeather();

            }
        })
}


function printWeather() {

    //print the current weather conditions as per the JSON response from the APIs

    let todayForecastContainer = document.createElement("div");
    todayForecastContainer.classList.add("card", "bg-light", "text-dark", "p-2");
    todayForecastContainer.setAttribute("id", "current-container");
    todayForecast.append(todayForecastContainer);

    let todayForecastCard = document.createElement('div');
    todayForecastCard.classList.add("card-body");

    let currentForecast = document.getElementById("current-container")

    let currentForecastFragment = document.createDocumentFragment();

    let currentForecastDetails = ["Conditions: " + weatherForecastData.current.weather[0].main, "Temp: " + weatherForecastData.current.temp, "Wind: " + weatherForecastData.current.wind_speed, "Humidity: " + weatherForecastData.current.humidity, "Uv Index: " + weatherForecastData.current.uvi];

    currentForecastDetails.forEach(function (current) {
        let liEl = document.createElement("li");
        liEl.textContent = current;
        currentForecastFragment.appendChild(liEl);

        //ADD STYLING FOR YOUR LI STUFF HERE
    })

    currentForecast.appendChild(currentForecastFragment);

    // let cityEl = document.createElement('h3');
    // cityEl.textContent = savedData[0].name + " - " + weatherForecastData.current.weather[0].main;
    // todayForecastCard.appendChild(cityEl);

    // let tempEl = document.createElement('li');
    // tempEl.textContent = "Temp: " + weatherForecastData.current.temp;
    // todayForecastCard.appendChild(tempEl);

    // let windEl = document.createElement('li');
    // windEl.textContent = "Wind speed: " + weatherForecastData.current.wind_speed;
    // todayForecastCard.appendChild(windEl);


    // let humidityEl = document.createElement('li');
    // humidityEl.textContent = "Humidity: " + weatherForecastData.current.humidity;
    // todayForecastCard.appendChild(humidityEl);

    // let uvEl = document.createElement('li');
    // uvEl.textContent = "UV Index: " + weatherForecastData.current.uvi;
    // todayForecastCard.appendChild(uvEl);

    //future forecast. Loop over the weatherForecastData.daily object and return conditions, temp, wind, humidity and UV for the next five days

    for (let i = 0; i < Object.keys(weatherForecastData.daily)[5]; i++) {

        //create bootstrap card for the five-day future forecast

        let fiveDayForecastContainer = document.createElement("div");
        fiveDayForecastContainer.classList.add("card", "bg-light", "text-dark", "p-2")
        fiveDayForecastContainer.setAttribute("id", "five-day-container");
        futureForecast.append(fiveDayForecastContainer);

        //create indivudal card elements with five-day forecast details on them


        // fiveDayForecastCard.textContent = weatherForecastData.daily[i].humidity;
        // fiveDayForecastContainer.appendChild(fiveDayForecastCard);

        // let fiveDayFutureForecast = document.getElementById("five-day-container")

        let futureForecastFragment = document.createDocumentFragment();

        let futureForecastDetails = ["Conditions: " + weatherForecastData.daily[i].weather[0].main, "Temp: " + weatherForecastData.current.temp, "Wind: " + weatherForecastData.daily[i].wind_speed, "Humidity: " + weatherForecastData.daily[i].humidity, "Uv Index: " + weatherForecastData.daily[i].uvi];

        futureForecastDetails.forEach(function (future) {

            // let fiveDayFutureForecastCard = document.createElement('div');
            // fiveDayFutureForecastCard.classList.add("card-body");
            // fiveDayFutureForecast.appendChild(fiveDayFutureForecastCard);

            let liEl = document.createElement("li");
            liEl.textContent = future;
            futureForecastFragment.appendChild(liEl);

            //ADD STYLING FOR YOUR LI STUFF HERE
        })

        fiveDayForecastContainer.appendChild(futureForecastFragment);
    }

}

// searchBtn.addEventListener("click", function () {

//     let searchInput = cityInputVal.value;
//     getApi(searchInput);
//     searchHistory.push(searchInput);
//     localStorage.setItem("search", JSON.stringify(searchHistory));

//     renderSearchHistory();

// })

// function renderSearchHistory() {
//     previousSearches.innerHTML = "";

//     for (let i = 0; i < searchHistory.length; i++) {

//         let prevSearchItem = document.createElement("p");

//         previousSearches.appendChild(prevSearchItem);
//     }

// }

// function savePreviousSearches() {

//     let prevHistory = [];
//     prevHistory = JSON.parse(localStorage.getItem("History")) || [];

//     prevHistory.push;

//     alert(prevHistory);

//     localStorage.setItem("History", JSON.stringify(prevHistory));
// }

// function searchHistory() {
//     previousSearches.city.push.(cityInputVal);
//     localStorage.setItem("City Name", JSON.stringify(cityInputVal));
// }

// function onLoad() {
//     if (localStorage.getItem("History")) {
//         previousSearches = JSON.parse(localStorage.getItem("History"));

//     }
// }

// function addHistory(previousSearchHistory) {
//     previousSearches.city.push(previousSearchHistory);
//     localStorage.setItem("History", JSON.stringify(previousSearches));
// }



searchFormEl.addEventListener("submit", formSubmitHandler);