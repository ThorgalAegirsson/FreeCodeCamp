(function () {
    'use strict';

    function init() {
        //DOM references
        var button = document.querySelector('button');
        var inpField = document.querySelector('input');
        var output = document.querySelector('#output');

        button.addEventListener('click', function () {
            output.textContent = convertToRoman(Number(inpField.value));
        });
    }

    // function convertToRoman(num){
    //     var numArr = (num.toString()).split('');
    //     console.log(numArr);
    // }

    function convertToRoman(num) {
        var convert = function (num) {
            var romanNumber = '';
            switch (num) {
                case 1:
                    romanNumber = romNumbers.I;
                    break;
                case 2:
                    romanNumber = romNumbers.I + romNumbers.I;
                    break;
                case 3:
                    romanNumber = romNumbers.I + romNumbers.I + romNumbers.I;
                    break;
                case 4:
                    romanNumber = romNumbers.I + romNumbers.V;
                    break;
                case 5:
                    romanNumber = romNumbers.V;
                    break;
                case 6:
                    romanNumber = romNumbers.V + romNumbers.I;
                    break;
                case 7:
                    romanNumber = romNumbers.V + romNumbers.I + romNumbers.I;
                    break;
                case 8:
                    romanNumber = romNumbers.V + romNumbers.I + romNumbers.I+romNumbers.I;
                    break;
                case 9:
                    romanNumber = romNumbers.I + romNumbers.X;
                    break;
            }
            romanNumArr.push(romanNumber);
        }

        var romNumbers;
        var romanNumArr = [];
        var thousands = Math.floor(num / 1000);
        var hundreds = Math.floor((num/100) - (thousands*10));
        var tens = Math.floor((num/10) - (thousands*100) - (hundreds*10));
        var ones = Math.floor(num - thousands*1000 - hundreds*100 - tens*10);
        console.log(ones);
        if (thousands) {
            romNumbers = {
                'I': 'M'
            };
            convert(thousands);
        }
        if (hundreds) {
            romNumbers = {
                'I': 'C',
                'V': 'D',
                'X': 'M'
            };
            convert(hundreds);
        }
        if (tens) {
            romNumbers = {
                'I': 'X',
                'V': 'L',
                'X': 'C'
            };
            convert(tens);
        }
        if (ones) {
            romNumbers = {
                'I': 'I',
                'V': 'V',
                'X': 'X'
            };
            convert(ones);
        }
        num = romanNumArr.join('');
        return num;
    }

    document.addEventListener('DOMContentLoaded', init);
})();