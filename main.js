"use strict";
const APIKEY = "16c8ff1d9b69d8157f41cdc2c71b6dec";

const form = document.querySelector(".form");
const primaryHeading = document.querySelector(".heading-primary");
const output = document.querySelector(".output");
const cityName = document.querySelector(".city-name");
const countryName = document.querySelector(".country");
const temperature = document.querySelector(".temp");
const tempMax = document.querySelector(".temp-max");
const tempMin = document.querySelector(".temp-min");
const sunriseTime = document.querySelector(".sunrise");
const sunsetTime = document.querySelector(".sunset");
const weatherDesc = document.querySelector(".weather-description");
const weatherIcon = document.querySelector(".weather-icon");
const feelsLike = document.querySelector(".feels-like");
const loader = document.querySelector(".lds-ring");
const error = document.querySelector(".error");

const xhr = new XMLHttpRequest();
// helper function to format time from UNIX timestamp to local time
const formatTime = (time) =>
  new Date(time * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
// helper function to format time from XML date to local time
const formatTimeXML = (date) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
// helper function to convert temperature from Kelvin to Fahrenheit
const kelvinToFahrenheit = (temp) =>
  ((temp - 273.15) * 1.8 + 32).toFixed(1) + " \u00B0F";

// helper function to get the country name from country code
const countryNameFromCode = (code) =>
  new Intl.DisplayNames(["en"], { type: "region" }).of(code);

xhr.open(
  "GET",
  `http://api.openweathermap.org/data/2.5/weather?q=paris,us&appid=${APIKEY}`,
  true
);

xhr.onreadystatechange = function () {
  // hide the output element while loading
  output.style.opacity = "0";
  output.style.visibility = "hidden";
  const status = xhr.status;
  // show the loader while waiting for the response
  if (this.readyState < 4) {
    loader.style.display = "block";
  }
  // if the response is complete and successful, update the DOM with the fetched data
  if (this.readyState === 4 && status === 200) {
    // use a timeout to simulate a delay in loading
    setTimeout(() => {
      // hide the loader and show the output element
      loader.style.display = "none";
      output.style.opacity = "1";
      output.style.visibility = "visible";
      // parse the JSON response text into an object
      const data = JSON.parse(xhr.responseText);
      // destructure the necessary data from the response object
      const {
        name,
        main: { temp, temp_max, temp_min, feels_like },
        weather,
        sys: { country, sunrise, sunset },
      } = data;
      // construct the URL for the weather icon
      const iconURL = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
      // update the DOM with the fetched data
      primaryHeading.textContent = "Using JSON";
      cityName.textContent = name;
      countryName.textContent = countryNameFromCode(country);
      temperature.textContent = kelvinToFahrenheit(temp);
      tempMax.textContent = kelvinToFahrenheit(temp_max);
      tempMin.textContent = kelvinToFahrenheit(temp_min);
      sunriseTime.textContent = formatTime(sunrise) + " UTC";
      sunsetTime.textContent = formatTime(sunset) + " UTC";
      weatherDesc.textContent = "Weather: " + weather[0].description;
      weatherIcon.src = iconURL;
      feelsLike.textContent = kelvinToFahrenheit(feels_like);
    }, 1000);
  }
};
xhr.send();
