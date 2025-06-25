export async function getWeather(location) {
  const API_KEY = "VFWHDE4WL6YS6DRWURUV84S3A";
  if (!location) location = "kuala lumpur";
  const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=${API_KEY}`;
  // TODO: include options
  const response = await fetch(link, { mode: "cors" });

  if (!response.ok) {
    console.log(response);
    console.log("Invalid location, status: " + response.status);
    return;
  }

  const data = await response.json();

  const dayWeathers = [];
  for (let i = 0; i < 7; i++) {
    const dayData = data.days[i];

    const hourWeathers = [];
    for (const hourData of dayData.hours) {
      const hour = hourData.datetime.split(":")[0];
      const hourWeather = new HourWeather(
        hour,
        hourData.temp,
        hourData.feelslike,
      );
      hourWeathers.push(hourWeather);
    }

    const dayWeather = new DayWeather(
      dayData.datetime,
      dayData.temp,
      dayData.feelslike,
      dayData.icon,
      hourWeathers,
    );
    dayWeathers.push(dayWeather);
  }

  displayWeather(dayWeathers);

  console.log(data);
}

async function displayWeather(weatherArr) {
  const weatherSection = document.querySelector("#weather-data");
  weatherSection.className = "show";
  const weatherRow = weatherSection.querySelector(".weather-row");
  const weatherRows = weatherSection.querySelectorAll(".weather-row");
  for (const row of weatherRows) {
    weatherSection.removeChild(row);
  }
  for (const dayWeather of weatherArr) {
    const newRow = weatherRow.cloneNode(true);
    let img = document.createElement("img");

    import(`./icons/${dayWeather.icon}.png`).then((module) => {
      const imgDiv = newRow.querySelector(".day-icon");
      imgDiv.innerHTML = "";
      img.src = module.default;
      imgDiv.appendChild(img);
    });

    newRow.querySelector(".date").innerText = dayWeather.date;
    newRow.querySelector(".day-temp").innerText = dayWeather.temp;
    newRow.querySelector(".day-feels-like").innerText = dayWeather.feelslike;

    newRow.addEventListener("click", () => {
      displayHourWeather(dayWeather);
    });
    weatherSection.appendChild(newRow);
  }
}

function displayHourWeather(dayWeather) {
  const weatherSection = document.querySelector("#hourly-weather");
  weatherSection.className = "show";
  const weatherCol = weatherSection.querySelector(".weather-col");
  const weatherCols = weatherSection.querySelectorAll(".weather-col");
  for (const col of weatherCols) {
    weatherSection.removeChild(col);
  }
  for (const hourWeather of dayWeather.hourWeathers) {
    const newCol = weatherCol.cloneNode(true);

    newCol.querySelector(".hour").innerText = hourWeather.hour;
    newCol.querySelector(".hour-temp").innerText = hourWeather.temp;
    newCol.querySelector(".hour-feels-like").innerText = hourWeather.feelslike;
    weatherSection.appendChild(newCol);
  }
}

function convertFtoC(fahrenheit) {
  return ((fahrenheit - 32) / (9 / 5)).toFixed(1);
}

class DayWeather {
  constructor(date, temp, feelslike, icon, hourWeathers) {
    this.date = date;
    this.temp = convertFtoC(temp);
    this.feelslike = convertFtoC(feelslike);
    this.hourWeathers = hourWeathers;
    this.icon = icon;
  }
}

class HourWeather {
  constructor(hour, temp, feelslike) {
    this.hour = hour;
    this.temp = convertFtoC(temp);
    this.feelslike = convertFtoC(feelslike);
  }
}
