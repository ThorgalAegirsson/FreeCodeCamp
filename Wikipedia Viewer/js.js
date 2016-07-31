var wikiAPI = (function () {
    'use strict';
    var api ={};
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

        //event listeners
        search.addEventListener('submit', function (e) {
            e.preventDefault();
            if (searchBox.value === '') {
                results.innerHTML = '';
                return;
            };

            
            // var processWiki = function (response) {
            //     console.log(JSON.parse(response));
            //     // results.innerHTML += 'result:<br> '+JSON.parse(response);
            // };
            wikiAPI.query('https://en.wikipedia.org/w/api.php', {
                action:"query",
                list:"search",
                srinfo:"totalhits",
                srlimit:50,
                srsearch:searchBox.value
            })(function(response){
                results.innerHTML = '<p>Found '+response.query.searchinfo.totalhits+' results for "' + searchBox.value + '":</p><div id="resultList"></div>';
                var resultList = document.getElementById('resultList');
                response.query.search.forEach(function(element) {
                    resultList.appendChild(renderItem(element));
                });
            });

            function renderItem(item){
                var divContainer = document.createElement('div');
                var title = document.createElement('p');
                var snippet = document.createElement('p');
                title.textContent = item.title;
                snippet.innerHTML = item.snippet;
                divContainer.appendChild(title);
                divContainer.appendChild(snippet);
                return divContainer;
            }
            //JSONP
            // var URL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srinfo=totalhits&srlimit=50&srsearch=' + searchBox.value + '&callback=' + processWiki;
            // var URL = 'https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&callback=callback5';
            // var script = document.createElement('script');
            // script.src = URL;
            // document.getElementsByTagName("head")[0].appendChild(script);

            //insert AJAX call function
            // var URL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srinfo=totalhits&srlimit=50&srsearch='+searchBox.value+'callback=processWiki';
            // var xhr = new XMLHttpRequest();
            // xhr.onload = function(resultObject){
            //     console.log(JSON.parse(resultObject));
            //     results.innerHTML += 'result: '+JSON.parse(resultObject);
            // };
            // xhr.onerror = function(error){
            //     results.innerHTML+= 'error: '+error+'<br>';
            //     console.log(JSON.stringify(error));
            // };
            // xhr.open('GET', URL, true);
            // // xhr.setRequestHeader("Origin", "http://esar.biz");
            // xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
            // xhr.send();

            //list results



        });
        randomBtn.addEventListener('click', function () {
            window.open('https://en.wikipedia.org/wiki/Special:Random');
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();



