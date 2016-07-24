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
            console.log(xhr.response);
            parseFunc(api.process(JSON.parse(xhr.response)));
            console.log('BY CITY FINISHED');
        };
        xhr.open('GET', URL,true);
        xhr.send();
    }

    api.getByZIP = function(zip, country, parseFunc){
        var URL = API_URL+'zip='+zip+','+country+ '&APPID=' + API_KEY;
        var xhr = new XMLHttpRequest();
        xhr.onload = function(){
            console.log(xhr.response);
            parseFunc(api.process(JSON.parse(xhr.response)));
            console.log('BY ZIP FINISHED');
        };
        xhr.open('GET', URL,true);
        xhr.send();
    }

    api.getByCoords = function (latitude, longitude, parseFunc) {
        var URL = API_URL+'lat=' + latitude + '&lon=' + longitude + '&APPID=' + API_KEY;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // console.log('response: ');
            console.log(xhr.response);
            // console.log('processed response: ');
            // console.log(api.process(JSON.parse(xhr.response)));
            parseFunc(api.process(JSON.parse(xhr.response)));
        };
        xhr.open('GET', URL, true);
        xhr.send();

        //TEMPORARY WEATHER OBJECT
        // parseFunc(api.process({
        //     "coord": {
        //         "lon": -73.99,
        //         "lat": 40.6
        //     },
        //     "weather": [
        //         {
        //             "id": 803,
        //             "main": "Clouds",
        //             "description": "broken clouds",
        //             "icon": "04n"
        //         }
        //     ],
        //     "base": "cmc stations",
        //     "main": {
        //         "temp": 296.33,
        //         "pressure": 1021,
        //         "humidity": 41,
        //         "temp_min": 291.15,
        //         "temp_max": 299.15
        //     },
        //     "wind": {
        //         "speed": 4.6,
        //         "deg": 20
        //     },
        //     "clouds": {
        //         "all": 75
        //     },
        //     "dt": 1468986218,
        //     "sys": {
        //         "type": 1,
        //         "id": 1975,
        //         "message": 0.0145,
        //         "country": "US",
        //         "sunrise": 1469007756,
        //         "sunset": 1469060499
        //     },
        //     "id": 5108815,
        //     "name": "Bensonhurst",
        //     "cod": 200
        // }));
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

        // console.log('local weather object: ');
        // console.log(weather);
        return weather;
    }

    return api;
})();