(function () {
    'use strict';

    function init() {
        // DOM references
        var head = document.getElementsByTagName('head')[0];
        var userContainer = document.getElementById('userContainer');
        var allItems = document.querySelector('.blue');
        var streamingItems = document.querySelector('.green');
        var offlineItems = document.querySelector('.gray');

        var channelArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "MacmillanCancer", "brunofin", "comster404"];
        var URL_STREAM;
        var URL_CHANNEL;

        var callback_stream = function (response) {
            var id = response._links.channel.slice(38).toLowerCase();
            var targetDIV = document.getElementById(id);
            var online = targetDIV.querySelector('.online');
            online.textContent = response.stream ? 'STREAMING:' : 'OFFLINE';
            // if (online.textContent !== 'STREAMING') {
            //     online.parentElement.classList.remove('streaming');
            // } else {
            //     online.parentElement.classList.add('streaming');
            // }
            if (response.stream) {
                online.parentElement.classList.add('streaming');
                targetDIV.querySelector('.title').textContent = response.stream.game + ': ';
                targetDIV.querySelector('.subtitle').textContent = response.stream.channel.status;
                targetDIV.querySelector('.viewers').textContent = 'Viewers: ' + response.stream.viewers;
                var preview = response.stream.preview.large; //or .medium or .template => add onHover
            } else {
                online.parentElement.classList.remove('streaming');
            }
        };

        var callback_channel = function (response) {
            console.log(response);
            var outerDIV = document.createElement('div');
            var logo = document.createElement('img');
            var userName = document.createElement('span');
            var online = document.createElement('p');
            var title = document.createElement('p');
            var subtitle = document.createElement('p');
            var viewers = document.createElement('p');
            outerDIV.appendChild(logo);
            outerDIV.appendChild(userName);
            outerDIV.appendChild(document.createElement('hr'));
            outerDIV.appendChild(online);
            outerDIV.appendChild(title);
            outerDIV.appendChild(subtitle);
            outerDIV.appendChild(viewers);
            outerDIV.classList.add('channel');
            logo.setAttribute('alt', 'Channel logo');
            online.classList.add('online');
            title.classList.add('title');
            subtitle.classList.add('subtitle');
            viewers.classList.add('viewers');
            document.getElementById('userContainer').appendChild(outerDIV);
            if (response.status === 422) { // Account doesn't exist
                var name = response.message.slice(response.message.indexOf("'")+1, response.message.lastIndexOf("'"));
                outerDIV.setAttribute('id', name);
                userName.textContent = name;
                logo.src = 'https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F';
                online.textContent = 'ACCOUNT DOESN\'T EXIST';
            } else { // Account exists
                outerDIV.setAttribute('id', response.name.toLowerCase());
                userName.textContent = response.display_name;
                logo.src = response.logo;
                outerDIV.addEventListener('click', function () {
                    window.open(response.url);
                });
                //JSONP to retrieve channel info
                URL_STREAM = 'https://api.twitch.tv/kraken/streams/' + response.name + '?callback=';
                var script1 = document.createElement('script');
                script1.src = URL_STREAM + encodeURIComponent('callback_stream');
                head.appendChild(script1);
            }



        };

        window.callback_channel = callback_channel;
        window.callback_stream = callback_stream;

        channelArray.forEach(function (item) {
            URL_CHANNEL = 'https://api.twitch.tv/kraken/channels/' + item + '?callback=';
            var script = document.createElement('script');
            script.src = URL_CHANNEL + encodeURIComponent('callback_channel');
            head.appendChild(script);
        });

        // ADD NEW USERS
        // add this functionality in the next version

        // SEARCH
        var searchField = document.querySelector('.toolbar>input');
        searchField.addEventListener('keyup', function () {
            Array.prototype.forEach.call(userContainer.querySelectorAll('.channel'), function (item) {
                if (item.id.indexOf(searchField.value.toLowerCase()) === -1) {
                    item.classList.add('hide');
                } else {
                    item.classList.remove('hide');
                }
            });
        })

        // FILTERS
        allItems.addEventListener('click', function () {
            Array.prototype.forEach.call(userContainer.querySelectorAll('.channel'), function (item) {
                item.classList.remove('hide');
            });
        });
        streamingItems.addEventListener('click', function () {
            Array.prototype.forEach.call(userContainer.querySelectorAll('.channel'), function (item) {
                if (item.classList.contains('streaming')) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
        offlineItems.addEventListener('click', function () {
            Array.prototype.forEach.call(userContainer.querySelectorAll('.channel'), function (item) {
                if (item.classList.contains('streaming')) {
                    item.classList.add('hide');
                } else {
                    item.classList.remove('hide');
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();