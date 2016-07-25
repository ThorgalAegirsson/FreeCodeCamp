var openWeatherAPI = (function () {
    'use strict';
    var api = {};
    var API_KEY = '6f86a5bd833343a837bfe5800ee695c4';
    var API_URL = 'http://api.openweathermap.org/data/2.5/weather?'

    //METHODS
    api.getByCity = function(city, country, parseFunc){
        var URL = API_URL+'q='+city+','+country+ '&APPID=' + API_KEY;
        var xhr = new XMLHttpRequest();
        xhr.onload = function(){
            parseFunc(api.process(JSON.parse(xhr.response)));
        };
        xhr.open('GET', URL,true);
        xhr.send();
    };

    api.getByZIP = function(zip, country, parseFunc){
        var URL = API_URL+'zip='+zip+','+country+ '&APPID=' + API_KEY;
        var xhr = new XMLHttpRequest();
        xhr.onload = function(){
            parseFunc(api.process(JSON.parse(xhr.response)));
        };
        xhr.open('GET', URL,true);
        xhr.send();
    };

    api.getByCoords = function (latitude, longitude, parseFunc) {
        var URL = API_URL+'lat=' + latitude + '&lon=' + longitude + '&APPID=' + API_KEY;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            parseFunc(api.process(JSON.parse(xhr.response)));
        };
        xhr.open('GET', URL, true);
        xhr.send();
    };

    api.process = function (data) {
        //pass response from API as data object
        var weather = {
            location: {
                city: data.name || 'not present',
                country: data.sys.country || 'not present'
            },
            wind: {
                speed: data.wind.speed || 'not present', //in MPH
                direction: data.wind.deg || 'not present' //direction in degrees
            },
            sunrise: data.sys.sunrise || 'not present', //unix, UTC
            sunset: data.sys.sunset || 'not present', //unix, UTC
            id: data.weather[0].id || 'not present', // weather condition code
            description:data.weather[0].description,
            icon: data.weather[0].icon || 'not present', //icon of the weather conditions
            cloudiness: data.clouds.all || 'not present', //in %
            // rain: data.rain['3h']; // rain in the last 3 hours
            // snow: data.snow['3h']; //snow in the last 3 hours
            tempF: Math.round(((data.main.temp - 273) * 1.8) + 32) || 'not present', //temperature in F
            tempC: Math.round(data.main.temp - 273) || 'not present', //temperature in C
            pressure: data.main.pressure || 'not present', //pressure in hPa
            humidity: data.main.humidity || 'not present' //in %
        };
        return weather;
    }
    return api;
})();