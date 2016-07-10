(function () {
    'use strict';

    function init() {
        //DOM references
        var box = document.getElementById('box');
        var quoteBox = document.getElementById('quoteBox');
        var twitter = document.getElementById('twitter');
        var tweetBtn = document.getElementById('tweetBtn');
        var nextBtn = document.getElementById('nextBtn');
        var tweet;

        //event listeners
        nextBtn.addEventListener('click', function () {
            tweet = displayQuote(quotes, quoteBox);
            tweetBtn.href = 'https://twitter.com/intent/tweet?text='+encodeURIComponent(tweet.text.substr(0, 118-tweet.author.length)+'-'+tweet.author)+'&via=ESAREnterprises&related=freecodecamp';
        });

        //select a quote
        function pickRndm(length) {
            var num = Math.floor(Math.random() * length);
            return num;
        }

        //display a quote
        function displayQuote(array, output) {
            var quoteText = output.getElementsByTagName('p');
            var quote = array[pickRndm(array.length)];
            quoteText[0].innerText = quote.text;
            quoteText[1].innerText = '- ' + quote.author;
            return quote;
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();

