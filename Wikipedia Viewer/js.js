var wikiAPI = (function () {
    'use strict';
    var api = {};
    /**
     * Query a MediaWiki api.php instance with the given options
     */
    function mwQuery(endpoint, options) {

        /**
         * Create a uniquely-named callback that will process the JSONP results
         */
        var createCallback = function (k) {
            var i = 1;
            var callbackName;
            do {
                callbackName = 'callback' + i;
                i = i + 1;
            } while (window[callbackName])
            window[callbackName] = k;
            return callbackName;
        }

        /**
         * Flatten an object into a URL query string.
         * For example: { foo: 'bar', baz: 42 } becomes 'foo=bar&baz=42'
         */
        var queryStr = function (options) {
            var query = [];
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    query.push(encodeURIComponent(i) + '=' + encodeURIComponent(options[i]));
                }
            }
            return query.join('&');
        }

        /**
         * Build a function that can be applied to a callback.  The callback processes
         * the JSON results of the API call.
         */
        return function (k) {
            options.format = 'json';
            options.callback = createCallback(k);
            var script = document.createElement('script');
            script.src = endpoint + '?' + queryStr(options);
            console.log(script.src);
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        };
    }

    api = {
        query: mwQuery,
    };
    return api;
})();



(function () {
    'use strict';

    function init() {
        console.log('JS loaded');
        //DOM references
        var randomBtn = document.getElementById('randomBtn');
        var searchBox = document.getElementById('searchBox');
        var search = document.getElementById('searchPart');
        var results = document.getElementById('results');

        //event listeners for buttons
        randomBtn.addEventListener('click', function () {
            window.open('https://en.wikipedia.org/wiki/Special:Random');
        });

        search.addEventListener('submit', function (e) {
            e.preventDefault();
            if (searchBox.value === '') {
                results.innerHTML = '';
                return;
            }

            //query Wikipedia
            wikiAPI.query('https://en.wikipedia.org/w/api.php', {
                action: "query",
                list: "search",
                srinfo: "totalhits",
                srlimit: 50,
                srsearch: searchBox.value,
                srprop: "snippet|redirecttitle|redirectsnippet|sectiontitle|sectionsnippet"
            })(function (response) {
                var text = '<p>Found ' + response.query.searchinfo.totalhits + ' results for "' + searchBox.value + '"';
                if (response.query.searchinfo.totalhits>50) text += '. Displaying the first 50 elements';
                text += ':</p><div id="resultList"></div>';
                results.innerHTML = text;
                var resultList = document.getElementById('resultList');
                response.query.search.forEach(function (element) {
                    resultList.appendChild(renderItem(element));
                });
            });

            function renderItem(item) {
                var divContainer = document.createElement('div');
                var link = document.createElement('a');
                var title = document.createElement('p');
                var snippet = document.createElement('p');
                title.textContent = item.title;
                snippet.innerHTML = item.snippet;
                link.appendChild(divContainer);
                divContainer.appendChild(title);
                divContainer.appendChild(snippet);
                link.href = 'http://en.wikipedia.org/wiki/'+encodeURIComponent(item.title);
                link.setAttribute('target', "_blank");
                return link;
            }
        });     
    }

    document.addEventListener('DOMContentLoaded', init);
})();



