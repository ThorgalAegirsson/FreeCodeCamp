var wikiQuoteAPI = (function(){
    'use strict';
     var api = {};

     var API_URL = 'http://en.wikiquote.org/w/api.php';

     api.getRandomQuote = function(authors, success, failure){

         var error = function(msg){
             failure(msg);
         };

         var selectQuote = function(quotes){
             
             console.log('final api function:');
             console.log(quotes);
             success({
                 author: quotes.titles,
                 quote: quotes.quotes[Math.floor(Math.random()*quotes.quotes.length)]
             });
         };

         var getQuotes = function(pageID, sections){
             api.getQuotesForSection(pageID, sections.sections[Math.floor(Math.random()*sections.sections.length)], selectQuote, error);
             //this API function sometimes takes a very long time to process 
             // FIX THIS !!!
         };

         var getSections = function(pageID) {
             api.getSectionsForPage(pageID, function (sections){
                 getQuotes(pageID, sections);
             },
             error);
         }
         
         api.query(authors, getSections, error);
     };

     api.query = function(titles, success, failure) {
     /**
     * Query based on "titles" parameter and return page id.
     * If multiple page ids are returned, choose the first one.
     * Query includes "redirects" option to automatically traverse redirects.
     * All words will be capitalized as this generally yields more consistent results.
     */
         $.ajax({
            url: API_URL,
            dataType: "jsonp",
            data: {
                format: "json",
                action: "query",
                redirects: "",
                titles: titles
            },

            success: function (result, status) {
                console.log('first result from query:');
                console.log(result);
                var pages = result.query.pages;
                var pageId = -1;
                for (var p in pages) {
                    var page = pages[p];
                    // api can return invalid records, these are marked as "missing"
                    if (!("missing" in page)) {
                        pageId = page.pageid;
                        break; //the first found page breaks the loop
                    }
                }
                if (pageId > 0) {
                    success(pageId);
                } else {
                    failure("No results returned");
                }
            },

            error: function (xhr, result, status) {
                failure("Error processing your query");
            }
        });
     };

     api.getSectionsForPage = function(pageID, success, failure) {
     /**
     * Get the sections for a given page.
     * This makes parsing for quotes more manageable.
     * Returns an array of all "1.x" sections as these usually contain the quotes.
     * If no 1.x sections exists, returns section 1. Returns the titles that were used
     * in case there is a redirect.
     */

        $.ajax({
            url: API_URL,
            dataType: "jsonp",
            data: {
                format: "json",
                action: "parse",
                prop: "sections",
                pageid: pageID
            },

            success: function (result, status) {
                console.log('second result from getSectionsForPage:');
                console.log(result);
                var sectionArray = [];
                var sections = result.parse.sections;
                for (var s in sections) {
                    var splitNum = sections[s].number.split('.');
                    if (splitNum.length > 1 && splitNum[0] === "1") {
                        sectionArray.push(sections[s].index);
                    }
                }
                // Use section 1 if there are no "1.x" sections
                if (sectionArray.length === 0) {
                    sectionArray.push("1");
                }
                success({ titles: result.parse.title, sections: sectionArray });
            },
            error: function (xhr, result, status) {
                failure("Error getting sections");
            }
        });

     };

     api.getQuotesForSection = function(pageID, sectionIndex, success, failure){
     /**
     * Get all quotes for a given section.  Most sections will be of the format:
     * <h3> title </h3>
     * <ul>
     *   <li> 
     *     Quote text
     *     <ul>
     *       <li> additional info on the quote </li>
     *     </ul>
     *   </li>
     * <ul>
     * <ul> next quote etc... </ul>
     *
     * The quote may or may not contain sections inside <b /> tags.
     *
     * For quotes with bold sections, only the bold part is returned for brevity
     * (usually the bold part is more well known).
     * Otherwise the entire text is returned.  Returns the titles that were used
     * in case there is a redirect.
     */
        $.ajax({
            url: API_URL,
            dataType: "jsonp",
            data: {
                format: "json",
                action: "parse",
                noimages: "",
                pageid: pageID,
                section: sectionIndex
            },

            success: function (result, status) {
                console.log('third result from getQuotesforSection:');
                console.log(result);
                var quotes = result.parse.text["*"];
                var quoteArray = []

                // Find top level <li> only
                var $lis = $(quotes).find('li:not(li li)');
                $lis.each(function () {
                    // Remove all children that aren't <b>
                    $(this).children().remove(':not(b)');
                    var $bolds = $(this).find('b');

                    // If the section has bold text, use it.  Otherwise pull the plain text.
                    if ($bolds.length > 0) {
                        quoteArray.push($bolds.html());
                    } else {
                        quoteArray.push($(this).html());
                    }
                });
                success({ titles: result.parse.title, quotes: quoteArray });
            },
            error: function (xhr, result, status) {
                failure("Error getting quotes");
            }
        });

     };

     return api;
})();


