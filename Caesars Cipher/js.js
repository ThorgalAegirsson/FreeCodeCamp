(function () {
    'use strict';

    function init() {
        //DOM references
        var txtInp = document.getElementById('txtInp');
        var changeBtn = document.getElementById('changeBtn');
        var output = document.getElementById('output');
        //btn listeners
        changeBtn.addEventListener('click', function(){
            output.innerText = change(txtInp.value);; 
            
        } )
        //logic
        function change(str) { // LBH QVQ VG!
            var tmpCode;
            str = str.toUpperCase();
            var textArr = str.split('');
            for (var i=0;i<textArr.length;i++){
                tmpCode = textArr[i].charCodeAt(0);
                if (tmpCode>64&&tmpCode<91){
                    if (tmpCode<78){
                        tmpCode +=13;
                    } else {
                        tmpCode -=13;
                    }
                    textArr[i] = String.fromCharCode(tmpCode);
                }
            }
            str = textArr.join('');
            return str;
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();