// Pune aici cheia ta OpenWeatherMap
const apiKey = "165f9a94e37555d2bdd3fa2d51ead13b"; // ← înlocuiește cu cheia ta validă

// Elemente DOM
const btn = document.getElementById("btn");
const detectBtn = document.getElementById("detect");
const input = document.getElementById("input");

const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const locationEl = document.getElementById("location");
const img = document.getElementById("weather-img");
const notFound = document.getElementById("notFound");
const weatherBox = document.querySelector('.weather-box');

// Funcție afisare date meteo
function showWeather(data) {
    if (!weatherBox || !notFound) return;

    if (data.cod === "404") {
        notFound.style.display = "block";
        weatherBox.style.display = "none";
        console.warn("City not found:", data.message);
        return;
    }

    if (data.cod === 401 || data.cod === "401") {
        notFound.style.display = "block";
        weatherBox.style.display = "none";
        console.error("Unauthorized! Check your API key:", data.message);
        alert("Unauthorized! Check your API key.");
        return;
    }

    notFound.style.display = "none";
    weatherBox.style.display = "block";

    temp.innerText = data.main.temp + "°C";
    desc.innerText = data.weather[0].description;
    locationEl.innerText = data.name + ", " + data.sys.country;

    const weatherMain = data.weather[0].main;
    if (weatherMain === "Clear") img.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    else if (weatherMain === "Rain") img.src = "https://cdn-icons-png.flaticon.com/512/414/414974.png";
    else if (weatherMain === "Snow") img.src = "https://cdn-icons-png.flaticon.com/512/642/642102.png";
    else img.src = "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
}

// Search manual
btn.addEventListener("click", () => {
    const city = input.value.trim();
    if (!city) {
        alert("Please enter a city!");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
        console.log("API Response:", data);
        showWeather(data);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        if(weatherBox) weatherBox.style.display = "none";
        if(notFound) notFound.style.display = "block";
        alert("Error fetching weather. Check console for details.");
    });
});

// Detectare automată locație
detectBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation not supported!");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
            console.log("API Response (geo):", data);
            showWeather(data);
        })
        .catch(err => {
            console.error("Fetch error:", err);
            if(weatherBox) weatherBox.style.display = "none";
            if(notFound) notFound.style.display = "block";
            alert("Error fetching weather. Check console for details.");
        });

    }, error => {
        alert("Could not get your location!");
    });
});