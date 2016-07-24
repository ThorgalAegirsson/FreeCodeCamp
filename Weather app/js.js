(function () {
    'use strict';

    function init() {
        console.log('JS loaded');
        //set highest scope variables
        var city;

        //initialization
        document.getElementById('checkDate').textContent = myTime();
        testOnline();

        function geoSuccessful(position) {
            // success function
            // FOR SOME REASON IE and EDGE ALWAYS GET GEO EVEN IF I REFUSE !!!!!
            console.log('geolocation successful, commencing weather update');
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            updateWeather(latitude, longitude);
        }

        function geoFailed() { // NOT TESTED YET
            // geolocation failed - eg. the user rejected the request
            console.log('geolocation present but failed');
            document.getElementsByTagName('form')[0].classList.add('showForm');
            document.getElementsByTagName('form')[0].onsubmit = function () {
                city = document.getElementById('city').value;
                document.getElementsByTagName('form')[0].classList.remove('showForm');
            };
        }

        function updateWeatherByCity(city, country){
            console.log('updateWeatherByCity started');
            openWeatherAPI.getByCity(city, country, parse);
        }

        function updateWeatherByZIP(location){
            console.log('updateWeatherByZIP started');
            
            openWeatherAPI.getByZIP(location.postal, location.country,parse);
            document.getElementsByClassName('city')[0].textContent = location.city+', '+location.region+', '+location.country;

        }

        function updateWeather(latitude, longitude) {
            // add city as a failover parameter
            console.log('updateWeather by lat/long started');
            openWeatherAPI.getByCoords(latitude, longitude, parse);
        }

        function parse(weather) {
                //parse data in UI
                //retrieve DOM elements
                var location = document.getElementsByClassName('city')[0];
                var description = document.getElementsByClassName('description')[0];
                var weatherIcon = document.getElementsByClassName('icon')[0];
                var weatherTemp = document.getElementsByClassName('temperature')[0];
                var weatherPress = document.getElementsByClassName('pressure')[0];
                var weatherHumid = document.getElementsByClassName('humid')[0];
                var weatherWind = document.getElementsByClassName('wind')[0];
                var weatherWindDeg = document.getElementsByClassName('winddeg')[0];
                var sunrise = document.getElementsByClassName('sunrise')[0];
                var sunset = document.getElementsByClassName('sunset')[0];
                var celsius = document.getElementsByClassName('cels')[0];
                var fahr = document.getElementsByClassName('fahr')[0];


                // location.textContent = weather.location.city + ', ' + weather.location.country;
                weatherTemp.textContent = weather.tempF;
                weatherPress.textContent = weather.pressure;
                weatherHumid.textContent = weather.humidity;
                weatherWind.textContent = weather.wind.speed;
                weatherWindDeg.textContent = String.fromCharCode(10168);
                weatherWindDeg.style.transform = 'rotate(' + (weather.wind.direction - 90) + 'deg)';


                //background and icon
                document.body.style.backgroundImage = generalCondition();
                weatherIcon.src = 'http://openweathermap.org/img/w/' + weather.icon + '.png';

                //sunrise and sunset
                sunrise.textContent = UTCtoLocal(weather.sunrise);
                sunset.textContent = UTCtoLocal(weather.sunset);
                function UTCtoLocal(time) {
                    var date = new Date(time * 1000);
                    var hours = date.getHours();
                    hours = (hours>12)?'0'+(hours-12):'0'+hours;
                    var minutes = "0" + date.getMinutes();
                    var seconds = "0" + date.getSeconds();

                    // Will display time in 10:30:23 format
                    var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                    return formattedTime;
                }

                //general condition
                function generalCondition(){
                    var time = (weather.icon.substr(-1)==='n')?'night':'day';
                    var descr;
                    var condition;
                    switch(weather.description){
                        case 'clear sky':
                        condition = descr = 'Clear';
                        // descr = 'Clear';
                        break;
                        case 'few clouds':
                        condition = 'Mostly-clear';
                        descr = "Mostly clear";
                        break;
                        case 'scattered clouds':
                        case 'broken clouds':
                        condition = descr = 'Cloudy';
                        // descr = 'Cloudy';
                        break;
                        case 'shower rain':
                        case "rain":
                        condition = descr = 'Rainy';
                        break;
                        case 'thunderstorm':
                        condition = 'Thunder';
                        descr = 'Thunderstorm';
                        break;
                        case 'snow':
                        condition = descr = 'Snowy';
                        break;
                        case 'mist':
                        condition = descr = 'Misty';
                        break;
                        default:
                        condition = 'default';
                        descr = 'Other';
                        break;
                    }
                    description.textContent = descr;
                    return "url('img/"+condition+"-"+time+".jpg')";
                }

                //temperature conversion
                function convertToC(){
                    weatherTemp.textContent = weather.tempC;
                    celsius.classList.remove('grayedout');
                    fahr.classList.add('grayedout');
                }

                function convertToF() {
                    weatherTemp.textContent = weather.tempF;
                    celsius.classList.add('grayedout');
                    fahr.classList.remove('grayedout');
                }

                //event listeners
                celsius.addEventListener('click', convertToC);
                fahr.addEventListener('click', convertToF);

            }


        function geolocate() {
            if (navigator.geolocation) {
                console.log('geolocation present');
                navigator.geolocation.getCurrentPosition(geoSuccessful, geoFailed);
            } else { //NOT TESTED YET
                console.log('no geolocation support');
                // move this to a separate function
                // there's no geolocation so enable the form and ask for the city
                // then move to updateWeather() function with the city as a parameter
                document.getElementsByTagName('form')[0].classList.toggle('showForm');
                document.getElementsByTagName('form')[0].onsubmit = function () {
                    city = document.getElementById('city').value;
                };
            }

            // 1. geolocate
            //  a. if no geolocate then
            //      ask for a city ('we couldn't locate, try entering the city below')
            //  b. if no city give msg that you can't determine location so sorry  no weather
            //      if you change your city go to settings and enter it again
        }





        // HELPER functions

        // ADD DATE/TIME
        function myTime() {
            var today = new Date();
            var day = '0' + today.getDate();
            var month = '0' + (today.getMonth() + 1);
            var hour = today.getHours();
            var meridiem = (hour < 12) ? 'AM' : 'PM';
            var min = '0' + today.getMinutes();
            hour = (meridiem === 'PM') ? hour - 12 : hour;
            hour = '0' + hour;

            return month.substr(-2) + '/' + day.substr(-2) + '/' + today.getFullYear() + " @ " + hour.substr(-2) + ":" + min.substr(-2) + " " + meridiem;
        }

        // Network Status
        function testOnline() {
            if (!navigator.onLine) {
                document.getElementsByClassName('weather')[0].textContent = 'You are offline. We can\'t check the weather';
            }

            testOnline = function () {
                var added = navigator.onLine ? "online" : "offline";
                var removed = (added === 'offline') ? 'online' : 'offline';
                document.getElementsByClassName('light')[0].classList.remove(removed);
                document.getElementsByClassName('light')[0].classList.add(added);
                document.getElementsByClassName('networkStatus')[0].classList.remove(removed);
                document.getElementsByClassName('networkStatus')[0].classList.add(added);
                document.getElementsByClassName('netStatus')[0].textContent = added.toUpperCase();
                // if (added === 'online') geolocate();
                if (added === 'online') updateByZIP();
            };
            testOnline();
        }

        function updateByCity(){
            var xhr = new XMLHttpRequest();
            xhr.onload = function(){
                console.log('response from ipinfo:');
                console.log(xhr.response);
                var response = JSON.parse(xhr.response);
                updateWeatherByCity(response.city, response.country);
            };
            xhr.open('GET', 'http://ipinfo.io/json', true);
            xhr.send();
        }

        function updateByZIP(){
            console.log('updatebyzip');
            var xhr = new XMLHttpRequest();
            xhr.onload = function(){
                console.log('response from ipinfo:');
                console.log(xhr.response);
                // var response = JSON.parse(xhr.response);
                updateWeatherByZIP(JSON.parse(xhr.response));
            };
            xhr.open('GET', 'http://ipinfo.io/json', true);
            xhr.send();
        }
        // EVENT LISTENERS
        window.addEventListener('online', testOnline);
        window.addEventListener('offline', testOnline);
        document.getElementsByClassName('byCity')[0].firstChild.addEventListener('click', updateByCity);
        document.getElementsByClassName('byZIP')[0].firstChild.addEventListener('click',updateByZIP);

    }

    document.addEventListener('DOMContentLoaded', init);
})();