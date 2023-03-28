"use strict";

////////////////////
form.addEventListener("submit", (e) => {
  output.style.opacity = "0";
  output.style.visibility = "hidden";
  e.preventDefault();

  const xhr = new XMLHttpRequest();

  const cityValue = document.querySelector(".input").value;
  // If the city input is empty, show an error message and return early
  if (!cityValue) {
    error.style.scale = "1";
    error.style.visibility = "visible";
    error.style.opacity = "1";
    setTimeout(() => {
      error.style.scale = "0";
      error.style.visibility = "hidden";
    }, 3000);
    return;
  }

  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityValue}&mode=xml&appid=${APIKEY}`;

  xhr.open("GET", weatherUrl, true);
  xhr.onreadystatechange = function () {
    const status = xhr.status;

    if (this.readyState < 4) {
      loader.style.display = "block";
    }

    if (this.readyState === 4 && status === 200) {
      setTimeout(() => {
        loader.style.display = "none";
        output.style.opacity = "1";
        output.style.visibility = "visible";

        const data = xhr.responseXML;
        const city = data.querySelector("city").getAttribute("name");
        const temp = data.querySelector("temperature").getAttribute("value");
        const temp_max = data.querySelector("temperature").getAttribute("max");
        const temp_min = data.querySelector("temperature").getAttribute("min");
        const weather = data.querySelector("weather").getAttribute("value");
        const feels_like = data
          .querySelector("feels_like")
          .getAttribute("value");
        const country = data.querySelector("city > country").textContent;
        const sunrise = data.querySelector("city  sun").getAttribute("rise");
        const sunset = data.querySelector("city  sun").getAttribute("set");

        primaryHeading.textContent = "Using XML";
        cityName.textContent = city;
        countryName.textContent = countryNameFromCode(country);
        temperature.textContent = kelvinToFahrenheit(temp);
        tempMax.textContent = kelvinToFahrenheit(temp_max);
        tempMin.textContent = kelvinToFahrenheit(temp_min);
        sunriseTime.textContent = formatTimeXML(sunrise) + " UTC";
        sunsetTime.textContent = formatTimeXML(sunset) + " UTC";
        weatherDesc.textContent = "Weather: " + weather;
        feelsLike.textContent = kelvinToFahrenheit(feels_like);
      }, 2000);
    }
  };

  xhr.send();
});
