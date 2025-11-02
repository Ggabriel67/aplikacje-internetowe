const WeatherApplication = class {
  constructor(apiKey, resultsBlockSelector) {
    this.apiKey = apiKey;
    this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
    this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;
    this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

    this.currentWeather = undefined;
    this.forecast = undefined;

    this.resultsBlock = document.querySelector(resultsBlockSelector);
  }

  getCurrentWeather(query) {
    let url = this.currentWeatherLink.replace("{query}", query);
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", () => {
      this.currentWeather = JSON.parse(req.responseText);
      console.log(this.currentWeather);
      this.drawWeather();
    });
    req.send();
  }

  getWeatherForecast(query) {
    let url = this.forecastLink.replace("{query}", query);
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      this.forecast = data.list;
      this.drawWeather();
    });
  }

  getWeather(query) {
    this.getCurrentWeather(query);
    this.getWeatherForecast(query);
  }

  drawWeather() {
    this.resultsBlock.innerHTML = '';

    if (this.currentWeather) {
      const date = new Date(this.currentWeather.dt * 1000);
      const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

      const temperature = this.currentWeather.main.temp;
      const feelsLikeTemperature = this.currentWeather.main.feels_like;
      const iconName = this.currentWeather.weather[0].icon;
      const description = this.currentWeather.weather[0].description;

      const weatherBlock = this.createResult(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
      this.resultsBlock.appendChild(weatherBlock);
    }

    if (this.forecast && this.forecast.length > 0) {
      for (let i = 0; i < this.forecast.length; i++) {
        let weather = this.forecast[i];
        const date = new Date(weather.dt * 1000);
        const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

        const temperature = weather.main.temp;
        const feelsLikeTemperature = weather.main.feels_like;
        const iconName = weather.weather[0].icon;
        const description = weather.weather[0].description;

        const weatherBlock = this.createResult(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
        this.resultsBlock.appendChild(weatherBlock);
      }
    }
  }

  createResult(dateString, temperature, feelsLikeTemperature, iconName, description) {
    const block = document.createElement("div");
    block.classList.add("weather-block");

    block.innerHTML = `
      <p><strong>${dateString}</strong></p>
      <img src="${this.iconLink.replace("{iconName}", iconName)}" alt="${description}">
      <p class="temp">${Math.round(temperature)}°C</p>
      <p class="feels">Odczuwalna: ${Math.round(feelsLikeTemperature)}°C</p>
      <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    `;

    return block;
  }
}

document.weatherApplication = new WeatherApplication("7a07dfe23d76241263a9326b3f9cdf6f", "#weather-result")

document.querySelector("#search-btn").addEventListener("click", function() {
    const query = document.querySelector("#city-input").value;
    document.weatherApplication.getWeather(query);
});
