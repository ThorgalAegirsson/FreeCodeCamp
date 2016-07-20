(function () {
    'use strict';

    function init() {
        console.log('JS loaded');
        //retrieve DOM elements

        //set highest scope variables
        var latitude, longitude, city;

        //initialization
        document.getElementById('checkDate').textContent = myTime();
        testOnline();

        function geoSuccessful(position) {
            // success function
            // FOR SOME REASON IE and EDGE ALWAYS GET GEO EVEN IF I REFUSE !!!!!
            console.log('geolocation successful, commencing weather update');
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            updateWeather(latitude, longitude);
        }

        function geoFailed() {
            // geolocation failed - eg. the user rejected the request
            console.log('geolocation present but failed');
            document.getElementsByTagName('form')[0].classList.add('showForm');
            document.getElementsByTagName('form')[0].onsubmit = function () {
                city = document.getElementById('city').value;
                document.getElementsByTagName('form')[0].classList.remove('showForm');
            };
        }

        function updateWeather(latitude, longitude) {
            // add city as a failover parameter
            console.log('updateWeather started');


        }


        function geolocate() {
            if (navigator.geolocation) {
                console.log('geolocation present');
                navigator.geolocation.getCurrentPosition(geoSuccessful, geoFailed);
            } else {
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
            var day = today.getDate();
            var month = today.getMonth() + 1;
            var hour = today.getHours();
            var meridiem = (hour < 12) ? 'AM' : 'PM';
            var min = today.getMinutes();
            hour = (meridiem === 'PM') ? hour - 12 : hour;
            hour = (hour < 10) ? '0' + hour : hour;
            min = (min < 10) ? '0' + min : min;
            day = (day < 10) ? '0' + day : day;
            month = (month < 10) ? '0' + month : month;

            return month + '/' + day + '/' + today.getFullYear() + " @ " + hour + ":" + min + " " + meridiem;
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
                if (added === 'online') geolocate();
            };
            testOnline();
        }
        window.addEventListener('online', testOnline);
        window.addEventListener('offline', testOnline);

    }

    document.addEventListener('DOMContentLoaded', init);
})();