Initially it was using geolocation but there two issues:

1. geolocation returned improper location name (neighborhoods or regions instead of city),
2. Evil Corp Chrome is blocking geolocation for a regular Joe - the website must be served with SSL.

I solved it by locating by IP. Thanks to that there's no need for permission from users or browsers. Here's how it goes:

1. IP location by ipinfo.io (returns city, region, country and zip)
2. weather object by zip from openWeather
3. since weather object returned has improper location name again I reuse the city and region from 1.


BUGS:

1. not all weather conditions are taken into account (http://openweathermap.org/weather-conditions)
2. 

TODO:

1. Forecast
2. Settings flyout
3. Responsive design