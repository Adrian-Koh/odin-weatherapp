export async function getWeather(location) {
  const API_KEY = "VFWHDE4WL6YS6DRWURUV84S3A";
  if (!location) location = "kuala lumpur";
  const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=${API_KEY}`;

  const response = await fetch(link, { mode: "cors" });

  if (!response.ok) {
    console.log(response);
    console.log("Invalid location, status: " + response.status);
    return;
  }

  const data = await response.json();

  const dayWeathers = [];
  for (let i = 0; i < 10; i++) {
    const dayWeather = new DayWeather(
      data.days[i].datetime,
      data.days[i].temp,
      data.days[i].feelslike,
    );
    dayWeathers.push(dayWeather);
  }

  displayWeather(dayWeathers);

  console.log(data);
}

function displayWeather(weatherArr) {
  const weatherSection = document.querySelector("#weather-data");
  const weatherRow = document.querySelector(".weather-row");
  for (const weather of weatherArr) {
    const newRow = weatherRow.cloneNode(true);

    newRow.querySelector(".date").innerText = weather.date;
    newRow.querySelector(".temp").innerText = weather.temp;
    newRow.querySelector(".feels-like").innerText = weather.feelslike;
    weatherSection.appendChild(newRow);
  }
}

class DayWeather {
  constructor(date, temp, feelslike) {
    this.date = date;
    this.temp = temp;
    this.feelslike = feelslike;
  }
}
