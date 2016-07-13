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
        var tweet;
        var quote;

        //pre-populate the page
        console.log('js started');
        getQuote();
        document.getElementsByClassName('console')[0].classList.toggle('showMe');


        //event listeners
        nextBtn.addEventListener('click', function () {
            document.getElementsByClassName('footnote')[0].style.display = 'block';
            document.getElementsByClassName('fallback')[0].style.display = 'none';
            console.log('btn pressed');
            getQuote();
        });

        consoleBtn.addEventListener('click', function () {
            document.getElementsByClassName('console')[0].classList.toggle('showMe');
        });

        // AJAX call to TheySaidSo

        function getQuote() {
            console.log('getQuote started');
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

            // WIKIQUOTE 
            console.log('wiki initialized');
            wikiQuoteAPI.getRandomQuote(authorList[Math.floor(Math.random() * authorList.length)],
                function (received) { // success
                    console.log('success');
                    console.log(received);
                    
                    // quote = JSON.parse(xhr.responseText).contents.quotes[0];
                    document.getElementsByClassName('footnote')[0].style.display = 'block';
                    document.getElementsByClassName('fallback')[0].style.display = 'none';
                    displayQuote(received, quoteBox);
                    tweetBtn.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(received.quote.substr(0, 118 - received.author.length) + '-' + received.author) + '&via=ESAREnterprises&related=freecodecamp';
                },
                function (msg) { //failure
                    console.log('failure');
                    console.log(msg);
                            
                    quote = quoteList[pickRndm(quoteList.length)];
                    document.getElementsByClassName('footnote')[0].style.display = 'none';
                    document.getElementsByClassName('fallback')[0].style.display = 'block';
                    displayQuote(quote, quoteBox);
                    tweetBtn.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(quote.quote.substr(0, 118 - quote.author.length) + '-' + quote.author) + '&via=ESAREnterprises&related=freecodecamp';
                    msg = (msg+'<br>')||'';
                        document.getElementsByClassName('fallback')[0].innerHTML = msg + 'AJAX failed, fallback to local quotes';

                });
            quoteBox.children[0].innerText = 'Waiting for response from WikiQuotes.org...';
            quoteBox.children[1].innerText = '';
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();




