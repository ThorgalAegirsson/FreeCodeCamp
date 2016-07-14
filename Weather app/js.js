(function () {
    'use strict';

    function init() {
        console.log('JS loaded');
        // check if online
        // if not say this and exit
        testOnline();

        window.addEventListener('online', testOnline);
        window.addEventListener('offline', testOnline);

        function testOnline() {
            var online = navigator.onLine ? "online" : "offline";
            document.getElementsByClassName('light')[0].classList.toggle(online);
            document.getElementsByClassName('netStatus')[0].classList.toggle(online);
            document.getElementsByClassName('netStatus')[0].textContent = online.toUpperCase();

            if (!navigator.onLine) {
                document.getElementsByClassName('weather')[0].textContent = 'You are offline. We can\'t check the weather';
            }
        }

        // check if geolocation
        // if not ask for the location


        var API_KEY = '6f86a5bd833343a837bfe5800ee695c4';
        var API_URL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude;


    }

    document.addEventListener('DOMContentLoaded', init);
})();