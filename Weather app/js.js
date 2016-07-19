(function () {
    'use strict';

    function init() {
        //retrieve DOM elements

        //set highest scope variables
        var latitude, longitude, city;

        console.log('JS loaded');
        document.getElementById('checkDate').textContent = myTime();
        // check if online
        // if not say this and exit
        window.addEventListener('online', testOnline);
        window.addEventListener('offline', testOnline);
        var networkStatus = testOnline();
        function testOnline() {
            var online = navigator.onLine ? "online" : "offline";
            document.getElementsByClassName('light')[0].classList.toggle(online);
            document.getElementsByClassName('networkStatus')[0].classList.toggle(online);
            document.getElementsByClassName('netStatus')[0].textContent = online.toUpperCase();

            return (online === 'online');
        }

        if (!networkStatus) {
            document.getElementsByClassName('weather')[0].textContent = 'You are offline. We can\'t check the weather';
        } else {

            geolocate();
            if (latitude) {
                console.log('latitude: ' + latitude);
                console.log('longitude: ' + longitude);
            } else {
                console.log('city: ' + city);
            }

            //
            // 2. OpenWeather API


        }

        function geolocate() {
            if (navigator.geolocation) {
                console.log('geolocation enabled');
                navigator.geolocation.getCurrentPosition(function (position) {
                    //success function
// FOR SOME REASON IE and EDGE ALWAYS GET GEO EVEN IF I REFUSE !!!!!
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    console.log(latitude);
                }, function () {
                    //geolocation failed - eg. the user rejected the request
                    console.log('geolocation enabled but failed');
                    document.getElementsByTagName('form')[0].classList.add('showForm');
                    document.getElementsByTagName('form')[0].onsubmit = function () {
                        city = document.getElementById('city').value;
                        document.getElementsByTagName('form')[0].classList.remove('showForm');
                    };
                });
            } else {
                cnosole.log('no geolocation');
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



        var API_KEY = '6f86a5bd833343a837bfe5800ee695c4';
        var API_URL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude;


        // HELPER functions
        // ADD DATE/TIME
        function myTime() {
            var today = new Date();
            var day = today.getDate();
            var month = today.getMonth() + 1;
            var year = today.getFullYear();
            day = (day < 10) ? '0' + day : day;
            month = (month < 10) ? '0' + month : month;

            return month + '/' + day + '/' + year;
        }

    }

    document.addEventListener('DOMContentLoaded', init);
})();