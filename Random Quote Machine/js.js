(function () {
    'use strict';

    function init() {
        //DOM references
        var box = document.getElementById('box');
        var quoteBox = document.getElementById('quoteBox');
        var twitter = document.getElementById('twitter');
        var tweetBtn = document.getElementsByClassName('tweetBtn')[0];
        var nextBtn = document.getElementById('nextBtn');
        var consoleBtn = document.getElementById('consoleBtn');
        var bottomMsg = document.getElementsByClassName('bottomMsg')[0];
        var source = document.getElementsByClassName('source')[0];
        var tweet;
        var quote;

        //pre-populate the page
        console.log('js started');
        bottomMsg.style.display = 'none';
        getQuote();
        


        //event listeners
        nextBtn.addEventListener('click', function () {
            source.style.display = 'block';
            bottomMsg.style.display = 'none';
            getQuote();
        });

        consoleBtn.addEventListener('click', function () {
            document.getElementsByClassName('console')[0].classList.toggle('showMe');
        });

        // AJAX call to TheySaidSo

        function getQuote() {
            //helper function - random from local quote DB

            function pickRndm(length) {
                var num = Math.floor(Math.random() * length);
                return num;
            }

            //helper function - display the quote
            //display a quote
            function displayQuote(quote, output) {
                var quoteText = output.getElementsByTagName('p');
                quoteText[0].style.opacity = 0;
                quoteText[1].style.opacity = 0;
                quoteText[0].innerHTML = quote.quote;
                quoteText[1].innerText = '- ' + quote.author;
                let j = 0;
                var fade = setInterval(function () {
                    quoteText[0].style.opacity = j;
                    quoteText[1].style.opacity = j;
                    j += 0.1;
                    if (j >= 1) clearInterval(fade);
                }, 200);

            }

            // WIKIQUOTE AJAX
            wikiQuoteAPI.getRandomQuote(authorList[Math.floor(Math.random() * authorList.length)],
                function (quote) { // success
                    // quote = JSON.parse(xhr.responseText).contents.quotes[0];
                    source.style.display = 'block';
                    bottomMsg.style.display = 'none';
                    displayQuote(quote, quoteBox);
                    tweetBtn.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(quote.quote.substr(0, 118 - received.author.length) + '-' + quote.author) + '&via=ESAREnterprises&related=freecodecamp';
                },
                function (msg) { //failure
                    quote = quoteList[pickRndm(quoteList.length)];
                    source.style.display = 'none';
                    bottomMsg.style.display = 'block';
                    displayQuote(quote, quoteBox);
                    tweetBtn.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(quote.quote.substr(0, 118 - quote.author.length) + '-' + quote.author) + '&via=ESAREnterprises&related=freecodecamp';
                    msg=(msg)?msg+'<br>':'';
                    document.getElementsByClassName('console')[0].innerHTML = msg + 'AJAX failed, fallback to local quotes';

                });
            quoteBox.children[0].innerText = 'Waiting for response from WikiQuotes.org...';
            quoteBox.children[1].innerText = '...be patient...';
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();




