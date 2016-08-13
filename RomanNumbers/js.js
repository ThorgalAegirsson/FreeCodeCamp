(function(){
    'use strict';

    function init(){
        //DOM references
        var button = document.querySelector('button');
        var inpField = document.querySelector('input');
        var output = document.querySelector('#output');

        button.addEventListener('click', function(){
            output.textContent = convertToRoman(Number(inpField.value));
        });
    }

    function convertToRoman(num){
        var romanNum='';
        switch (num) {
            case 1:
            case 2:
            case 3: 
                for (let i = 1; i<=num; i++){
                    romanNum += 'I';
                }
                break;
            case 4:
                romanNum = 'I'+'V';
                break;
            case 5:

                break;
            case 6:
            case 7:
            case 8:
                
                break;
            case 9:

                break;
        }
        num = romanNum;
        return num;
    }

    document.addEventListener('DOMContentLoaded', init);
})();