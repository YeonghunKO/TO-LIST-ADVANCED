const js_weather = document.querySelector(".js_weather"),
      weather_box = js_weather.querySelector(".weather_box"),
      city = weather_box.querySelector(".city"),
      weather = weather_box.querySelector(".weather"),
      weather_desciption = weather.querySelector(".weather_description"),
      weather_icon = weather.querySelector(".weather_icon"),
      current_temp = weather_box.querySelector(".current_temp"),
      feel_like = weather_box.querySelector(".feel_like");

const API_KEY = "fdc043150b4a4dabe389dd2724e69e21"; 

const COORDS = "coords";


function getWeather(lat, lng) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=kr`
    )
    .then((response) => {
        return response.json() 
        // 위에 fetch를 통해 받은 API값을(response) JSON 형태로 인코딩했다. 무슨말인지 모르겠으면 console.log로 프린트해봐라.
        // 그리고 그 값을 저장했다.  
        // API와 .then() 함수에 대한 설명은 아래 간략하게 적어놓았다.
    })
    .then((json) => {
        // 위의 then을 통해 받은 api 데이터안에서 원하는 값을 extract 한다.
        const cityJson = json.name,
              weatherJsonIcon = json.weather[0].icon,
              currentTempJson = json.main.temp,
              feelLiksJson = json.main.feels_like; 
        city.innerHTML = `도시: ${cityJson}`;
        weather_desciption.innerHTML = "날씨:";
        weather_icon.src = `http://openweathermap.org/img/wn/${weatherJsonIcon}.png`;
        current_temp.innerHTML = `현재기온: ${currentTempJson}℃`;
        feel_like.innerHTML = `체감기온: ${feelLiksJson}℃`;
    });

}


function saveCoords(obj) {
    localStorage.setItem(COORDS,JSON.stringify(obj));
}

function handleGeoSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    console.log(latitude, longitude)
    saveCoords(coordsObj);
    getWeather(latitude,longitude)

}

function handdleGeoError() {
    alert("Can't access geo location");
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handdleGeoError)
}


function loadCoords() {
    const loadedCords = localStorage.getItem(COORDS);
    if(loadedCords === null) {
        askForCoords();
    } else {
        const parsedCoords = JSON.parse(loadedCords);
        // console.log(parsedCoords)
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}


function init() {
    loadCoords();
}

init();

// API란?
// 기본적으로는 운영체제, 프로그래밍언어가 제공하는 '기능'을 제어할 수 있게하는 인터페이스를 뜻한다. 주로 창제어 화상처리 문자제어 같은것을 의미
// 근데 웹에서의API는 데이터를 요청하고 응답하는게 전부다.
// then함수는 API 를 호출하고 받는 역할을 하는 함수다.
