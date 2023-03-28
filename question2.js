"use strict";

// Open a GET request to the OpenWeatherMap API to find information on Paris
xhr.open(
  "GET",
  `http://api.openweathermap.org/data/2.5/find?q=paris&appid=${APIKEY}`,
  true
);
// Set up a callback function to execute when the state of the request changes
xhr.onreadystatechange = function () {
  // Declare an empty string to hold the output display
  let outputDisplay = "";
  // Get the status of the request
  const status = xhr.status;
  // Check if the request is finished and successful
  if (this.readyState === 4 && status === 200) {
    // Parse the JSON response from the server
    const data = JSON.parse(xhr.responseText);

    // Get the list of cities from the response
    const { list } = data;

    // This  `http://api.openweathermap.org/data/2.5/find?q=paris&appid=${APIKEY}` url
    // didn't have sunset and sunrise values so I have to loop over the data and again
    // fetch the data
    // Loop through each city in the list
    list.forEach((city) => {
      // Get the name and country of the city
      const {
        name,
        sys: { country },
      } = city;

      // Create a new XMLHttpRequest object for this city's weather data
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `http://api.openweathermap.org/data/2.5/weather?q=${name},${country}&appid=${APIKEY}`,
        true
      );

      xhr.onreadystatechange = function () {
        output.style.opacity = "0";
        output.style.visibility = "hidden";
        const status = xhr.status;

        if (this.readyState < 4) {
          loader.style.display = "block";
        }

        if (this.readyState === 4 && status === 200) {
          setTimeout(() => {
            loader.style.display = "none";
            output.style.opacity = "1";
            output.style.visibility = "visible";
            const data = JSON.parse(xhr.responseText);

            const {
              name,
              main: { temp, temp_max, temp_min, feels_like },
              weather,
              sys: { country, sunrise, sunset },
            } = data;

            const iconURL = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
            outputDisplay += `
    <div>
    <h3 class="city-name">${name}</h3>
    <h4 class="country">${countryNameFromCode(country)}</h4>
    <p class="weather">Weather Report</p>

    <div class="weather-container">
    <p class="weather-description">Weather: ${weather[0].description}</p>
    <img class="weather-icon" src=${iconURL} alt="Weather Icon" />
    </div>
    <div class="weather-report">
      <div>
        <p>Temperature <span class="temp">${kelvinToFahrenheit(temp)}</span></p>
       
      </div>

      <div>
      <p>Feels like <span class="feels-like">${kelvinToFahrenheit(
        feels_like
      )} </span></p>
        <p>Max temp  <span class="temp-max">${kelvinToFahrenheit(
          temp_max
        )}</span></p>
        <p>Min temp  <span class="temp-min">${kelvinToFahrenheit(
          temp_min
        )}</span></p>
      </div>

      <div>
        <p>Sunrise  <span class="sunrise">${
          formatTime(sunrise) + " UTC"
        }</span></p>
        <p>Sunset  <span class="sunset">${
          formatTime(sunset) + " UTC"
        }</span></p>
      </div>
    </div>
  </div>
</div>
    `;

            output.innerHTML = outputDisplay;
          }, 1000);
        }
      };

      xhr.send();
    });
  }
};
xhr.send();
