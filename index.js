import { keyWeather } from "./config.js";
import { convertTime } from "./convertTime.js";
import { convertWindDeg } from "./convertWindDeg.js";
import { createChart } from "./createChart.js";

let cityNameValue;
let country;
let latitude;
let longitude;
let aqi;
let evaluationAQI;
let evaluationUV;

/// Set up page

const main = document.createElement("main");
document.body.appendChild(main);
main.innerHTML = `<div id="search">
        <input type="text" id="city" placeholder="Search for a city..." name="city"/>
        <button id="btnSearch" type="submit" class="button">Search</button>
        <button id="btnClear" class="button" type="reset">Clear</button>
    </div>
    <div id="day-container"></div>
    <div id="hourlyForecast"></div>
    <div id="sevenDayForecast"></div>`;

const btnSearch = document.querySelector("#btnSearch");
const btnClear = document.querySelector("#btnClear");
const city = document.querySelector("#city");

const footer = document.createElement("footer");
document.body.appendChild(footer);
footer.innerText = "\u00A9" + " 2022 Franziska. All rights reserved.";

let dayContainer = document.querySelector("#day-container");
let hourlyForecast = document.querySelector("#hourlyForecast");
let sevenDayContainer = document.querySelector("#sevenDayForecast");

/// Function to get air pollution data

//Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
async function getPollutionData(latitude, longitude) {
  let url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${keyWeather}`;
  try {
    let input = await fetch(url);
    let response = await input.json();
    aqi = response.list[0].main.aqi;
    if (aqi == 1) {
      evaluationAQI = "Good";
    } else if (aqi == 2) {
      evaluationAQI = "Fair";
    } else if (aqi == 3) {
      evaluationAQI = "Moderate";
    } else if (aqi == 4) {
      evaluationAQI = "Poor";
    } else if (aqi == 5) {
      evaluationAQI = "Very poor";
    } else {
      evaluationAQI = "Not available";
    }
  } catch (error) {
    console.log(error);
  }
}

/// Function to get weather data

async function getWeatherData(latitude, longitude) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely&appid=${keyWeather}`;
  try {
    let input = await fetch(url);
    let response = await input.json();

    // Current forecast

    let weekdayName = new Date(response.current.dt * 1000).toLocaleDateString(
      "en",
      { weekday: "long" }
    );

    let currentHour = new Date(response.current.dt * 1000).getHours();
    let currentDay = new Date(response.current.dt * 1000).toLocaleString(
      "en-US",
      { day: "numeric" }
    );
    let currentMonth = new Date(response.current.dt * 1000).toLocaleString(
      "en-US",
      { month: "long" }
    );
    let currentYear = new Date(response.current.dt * 1000).toLocaleString(
      "en-US",
      { year: "numeric" }
    );
    let dateValue = currentDay + "/" + currentMonth + "/" + currentYear;

    let humidityValue = response.current.humidity;
    let dewpoint = response.current.dew_point.toFixed(0);

    let temperatureTemp = response.current.temp.toFixed(0);
    let feelTemp = response.current.feels_like.toFixed(0);

    let windKMPH = (response.current.wind_speed * 3.6).toFixed(1);
    let direction = convertWindDeg(response.current.wind_deg);

    let iconID = response.current.weather[0].icon;
    let weatherIconURL =
      "http://openweathermap.org/img/wn/" + iconID + "@2x.png";

    let visibility = response.current.visibility / 1000;

    let uvi = response.current.uvi.toFixed(0);
    if (uvi <= 2) {
      evaluationUV = "No protection needed";
    } else if (uvi > 2 && uvi < 8) {
      evaluationUV = "Protection required";
    } else if (uvi >= 8 && uvi < 11) {
      evaluationUV = "Extra protection required";
    } else if (uvi >= 11) {
      evaluationUV = "Stay inside";
    }

    let sunriseTime = convertTime(response.current.sunrise);

    let sunsetTime = convertTime(response.current.sunset);

    // Day forecast summary

    let dayMinTemp = response.daily[0].temp.min.toFixed(0);
    let dayMaxTemp = response.daily[0].temp.max.toFixed(0);
    let expectation = response.daily[0].weather[0].description;

    let currentForecast = `<p id="day">${weekdayName}</p>
            <p id="date">${dateValue}</p>
            <div id="location">
                <p class="fas">&#xf3c5;</p>
                <p id="city-name">${cityNameValue},</p>
                <p id="country">${country}</p>
            </div>
            <h2 id="greeting"></h2>
            <div id="current">
                <div id="icon"><img id="wicon" src="${weatherIconURL}" alt=""></div>
                <div id="currentTemp">
                    <p id="temperature">${temperatureTemp}&degC</p>
                    <p id="feelTemperature">Feels like ${feelTemp}&degC</p>
                </div>
            </div>
            <p id="forecastSummary">Today the high will be ${dayMaxTemp}&degC; the low will be ${dayMinTemp}&degC; expect ${expectation}.</p>
            <div id="extra-info">
                <div id="humidity-prediction">
                    <p class="text">Humidity</p>
                    <p class="text" id="humidity">${humidityValue}%</p>
                </div>
                <div id="dewpoint-prediction">
                    <p class="text">Dew point</p>
                    <p class="text" id="dewpoint">${dewpoint}&degC</p>
                </div>
                <div id="wind-prediction">
                    <p class="text">Wind</p>
                    <p class="text" id="windDirection">${direction}</p>
                    <p class="text" id="wind">${windKMPH} km/h</p>
                </div>
                <div id="airquality-prediction">
                    <p class="text">Air quality index</p>
                    <p class="text" id="aqi">${aqi} (${evaluationAQI})</p>
                </div>
                <div id="uv-prediction">
                    <p class="text">UV index</p>
                    <p class="text" id="uvi">${uvi} (${evaluationUV})</p>
                </div>
                <div id="visibility-prediction">
                    <p class="text">Visibility</p>
                    <p class="text" id="visibility">${visibility} km</p>
                </div>
                <div id="sunrise-prediction">
                    <p class="text">Sunrise</p>
                    <p class="text" id="sunrise">${sunriseTime}</p>
                </div>
                <div id="sunset-prediction">
                    <p class="text">Sunset</p>
                    <p class="text" id="sunset">${sunsetTime}</p>
                </div>
            </div>`;
    dayContainer.innerHTML = currentForecast;

    let greeting = document.querySelector("#greeting");
    let temperature = document.querySelector("#temperature");

    if (currentHour >= 5 && currentHour < 12) {
      greeting.innerHTML = "Good morning";
      main.classList.add("morning", "morningM");
      footer.classList.add("morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      greeting.innerHTML = "Good afternoon";
      main.classList.add("afternoon", "afternoonM");
      footer.classList.add("afternoon");
    } else {
      greeting.innerHTML = "Good evening";
      main.classList.add("evening", "eveningM");
      footer.classList.add("evening");
    }

    if (temperatureTemp <= 10) {
      temperature.classList.add("coldTemp");
    } else if (temperatureTemp >= 30) {
      temperature.classList.add("warmTemp");
    }

    // Hourly forecast

    hourlyForecast.innerHTML = `<div class="tab">
                <button id="tempBtn" class="tablinks active">Temperature</button>
                <button id="precBtn" class="tablinks">Precipitation</button>
            </div>
            <div id="temperatureTab" class="visible">
                <div class="chartContainer">
                    <canvas id="temperatureChart"></canvas>
                </div>
            </div>
            <div id="precipitationTab" class="invisible">
                <div class="chartContainer">
                    <canvas id="precipitationChart"></canvas>
                </div>
            </div>`;

    // Click functions for temperature & precipitation tabs

    let temperatureTab = document.getElementById("temperatureTab");
    let precipitationTab = document.getElementById("precipitationTab");
    let temperatureButton = document.getElementById("tempBtn");
    let precipitationButton = document.getElementById("precBtn");

    const openTemperatureTab = () => {
      temperatureButton.className = "tablinks active";
      precipitationButton.className = "tablinks";
      temperatureTab.className = "visible";
      precipitationTab.className = "invisible";
    };

    const openPrecipitationTab = () => {
      temperatureButton.className = "tablinks";
      precipitationButton.className = "tablinks active";
      temperatureTab.className = "invisible";
      precipitationTab.className = "visible";
    };

    temperatureButton.addEventListener("click", openTemperatureTab);
    precipitationButton.addEventListener("click", openPrecipitationTab);

    // Create line charts for 24h temperature & precipitation forecast

    const yBGC = "rgb(255,204,0)"; //colour of data points
    const bBGC = "rgb(111,134,183)";
    const yBC = "rgb(255,204,0)"; //colour of curve
    const bBC = "rgb(111,134,183)";
    const yFC = "rgb(249,242,187"; //colour of fill under curve
    const bFC = "rgb(155,187,255)";
    const tAxisTitle = "Temperature \u{00B0}C";
    const pAxisTitle = "Precipitation %";
    const tChartID = document.getElementById("temperatureChart");
    const pChartID = document.getElementById("precipitationChart");

    let hourArray = [];
    let tempArray = [];
    let precArray = [];
    for (let i = 1; i < 26; i++) {
      let hourStep = new Date(response.hourly[i].dt * 1000).getHours();
      hourArray.push(hourStep + ":00");
      let tempStep = response.hourly[i].temp;
      tempArray.push(tempStep);
      let precStep = response.hourly[i].pop * 100;
      precArray.push(precStep);
    }
    createChart(tempArray, hourArray, yBGC, yBC, yFC, tAxisTitle, tChartID);
    createChart(precArray, hourArray, bBGC, bBC, bFC, pAxisTitle, pChartID);

    // 7-day forecast

    sevenDayContainer.innerHTML = `<h4>7-DAY FORECAST</h4>
            <div id="forecast-container"></div>`;

    let forecastContainer = document.querySelector("#forecast-container");
    response.daily.forEach((value, index) => {
      if (index > 0) {
        let dayName = new Date(value.dt * 1000).toLocaleDateString("en", {
          weekday: "short",
        });
        let dailyIconID = value.weather[0].icon;
        let dailyMinTemperature = value.temp.min.toFixed(0);
        let dailyMaxTemperature = value.temp.max.toFixed(0);
        let precipitation = value.pop * 100;
        let sevenDayForecastData = `<div class="dayForecast">
                        <p id="dayNameText">${dayName}</p>
                        <p id="dailyIcon"><img id="dailyWicon" src="http://openweathermap.org/img/wn/${dailyIconID}.png" alt=""></p>
                        <div id="maxTemp">
                            <p id="maxTempText" class="text">H</p>
                            <p class="forecastText">${dailyMaxTemperature}&degC</p>
                        </div>
                        <div id="minTemp">
                            <p id="minTempText" class="text">L</p>
                            <p class="forecastText">${dailyMinTemperature}&degC</p>
                        </div>
                        <div id="PoP">
                            <p id="PoPText" class="text"><i class="fa-solid fa-droplet"></i></p>
                            <p class="forecastText">${precipitation.toFixed(
                              0
                            )}%</p>
                        </div>
                    </div>`;
        forecastContainer.innerHTML += sevenDayForecastData;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const getCoordinates = () => {
  let url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityNameValue}&limit=1&appid=${keyWeather}`;
  try {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        country = data[0].country;
        latitude = data[0].lat;
        longitude = data[0].lon;
        getPollutionData(latitude, longitude);
        getWeatherData(latitude, longitude);
      });
  } catch (error) {
    console.log(error);
  }
};

/// Function to check screen width

const bigScreen = window.matchMedia("(min-width: 600px)");
const smallScreen = window.matchMedia("(max-width: 600px)");

const search = () => {
  const searchString = city.value.toUpperCase();
  cityNameValue = searchString;
  if (cityNameValue) {
    getCoordinates();
  }
};
const clear = () => {
  if (cityNameValue) {
    city.value = "";
  }
};

const screenCheck = () => {
  if (bigScreen.matches) {
    /// Actions after clicking search button
    btnSearch.addEventListener("click", search);

    /// Clearing input field after clicking clear button
    btnClear.addEventListener("click", clear);
  } else if (smallScreen.matches) {
    /// Actions after touching search button
    btnSearch.addEventListener("touchstart", search);

    /// Clearing input field after touching clear button
    btnClear.addEventListener("touchstart", clear);
  }
};

/// Actions when page is loaded

const setUp = () => {
  screenCheck();
  bigScreen.addListener(screenCheck); // Attach listener function on state change
  smallScreen.addListener(screenCheck);
  latitude = 51.057496;
  longitude = 3.732703;
  cityNameValue = "GENT";
  country = "BE";
  getPollutionData(latitude, longitude);
  getWeatherData(latitude, longitude);
};

window.addEventListener("load", setUp);
