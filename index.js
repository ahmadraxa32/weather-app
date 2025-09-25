const input = document.querySelector(".input");
const btn = document.querySelector(".btn");
const Display_Weather = document.querySelector(".Display_Weather");
const Api_key = "282d9e34e7995ca26d42d209760fddb0";

let saved = JSON.parse(localStorage.getItem("Weather_Data")) || [];

async function Get_Weather_API() {
  const city = input.value.trim();
  if (!city) return;

  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_key}`
  );
  const response = await data.json();
  console.log(response);

  if (!data.ok) {
    let card = `<br><h3>Error : Sorry City Not Found. Try Again....!</h3>`;
    const pallet = document.createElement("div");
    pallet.innerHTML = card;
    pallet.classList.add("pallet");

    const X_btn = document.createElement("button");
    X_btn.innerText = "X";
    X_btn.classList.add("Cross_btn");
    X_btn.addEventListener("click", () => {
      Display_Weather.removeChild(pallet);
    });

    pallet.appendChild(X_btn);
    Display_Weather.appendChild(pallet);
    reset();
    return;
  }

  const ALL_DATA = {
    City_name: response.name,
    humidity: response.main.humidity,
    temp: response.main.temp,
    weather_description: response.weather[0].description,
  };

  const pallet = document.createElement("div");
  pallet.classList.add("pallet");

  let card = `
    <h3>City : ${ALL_DATA.City_name}</h3>
    <h3>Humidity : ${ALL_DATA.humidity}%</h3>
    <h3>Weather : ${ALL_DATA.weather_description}</h3>
    <h3>Temperature : ${(ALL_DATA.temp - 273.15).toFixed(1)}°C</h3>
  `;

  pallet.innerHTML = card;

  const X_btn = document.createElement("button");
  X_btn.innerText = "X";
  X_btn.classList.add("Cross_btn");
  X_btn.addEventListener("click", () => {
    saved = saved.filter((item) => item.City_name !== ALL_DATA.City_name);
    localStorage.setItem("Weather_Data", JSON.stringify(saved));
    Display_Weather.removeChild(pallet);
  });

  pallet.appendChild(X_btn);
  Display_Weather.appendChild(pallet);

  if (!saved.some(item => item.City_name === ALL_DATA.City_name)) {
    saved.push(ALL_DATA);
    localStorage.setItem("Weather_Data", JSON.stringify(saved));
  }

  reset();
}

btn.addEventListener("click", Get_Weather_API);

function reset() {
  input.value = "";
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    Get_Weather_API();
  }
});
