/**
 * Created by a.chistyakov on 14.08.2015.
 */
(function($){
    /**
     * @param url
     * @param callback
     * @constructor
     */
    $.Hoojax = function(url, callback){
        /*
         Because JQuery thinks it is cleverer then me and
         needs tons of code to really just give me the data
         */
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function(){

            if (this.readyState == 4 && this.status == 200){
                callback();
            }
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    };

})(jQuery);
