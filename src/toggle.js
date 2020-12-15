const functionButton = document.querySelector(".see_function"),
      fucntionList = document.querySelector(".section"),
      functionArrow = functionButton.querySelector(".functionArrow");
const weatherButton = document.querySelector(".see_weather"),
      weatherList = document.querySelector(".weather_box"),
      weatherArrow = weatherButton.querySelector(".weatherToggleImg")

let a_pressed = false;
function displayFunction(event) {
    if (a_pressed === false) {
        functionButton.classList.add("forBtnWidth");
        fucntionList.classList.remove("non-showing");
        fucntionList.classList.add("ex_box");
        functionArrow.classList.add("non-showing");
        a_pressed = true;
    } else {
        functionButton.classList.remove("forBtnWidth");
        fucntionList.classList.add("non-showing");
        fucntionList.classList.remove("ex_box");
        functionArrow.classList.remove("non-showing");
        a_pressed = false;
    }
}

let b_pressed = false;
function displayWeather() {
    if (b_pressed === false) {
        weatherButton.classList.add("forWeatherBtnWidth");
        weatherList.classList.remove("non-showing");
        weatherArrow.classList.add("non-showing");
        b_pressed = true;
    } else {
        weatherButton.classList.remove("forWeatherBtnWidth");
        weatherList.classList.add("non-showing");
        weatherArrow.classList.remove("non-showing");
        b_pressed = false;
    }
}

function init() {
    functionButton.addEventListener("click", displayFunction);
    weatherButton.addEventListener("click", displayWeather);
}

init()