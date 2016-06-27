/**
 * Created by calvinmcm on 6/27/16.
 */

define([],function(){




    /**
     * Image Resource Constructor
     * Tracks the loading process of an image.
     * @constructor
     */
    function ImageResource(key, url, counter){
        this.key = key;
        this.url = url;
        this.loaded = false;
        this.image = null;
        this.counter = counter;
    }

    /**
     * Kicks off the loading process for the image.
     * Returns a promise that is resolved with the image object once the image has loaded.
     * @returns {Promise}
     */
    ImageResource.prototype.getImage = function(){
        var self = this;
        return(new Promise(function(resolve, reject){

            self.image = new Image();
            self.image.onload = function() {
                self.loaded = true;
                if(self.counter != null){
                    resolve(self.image);
                }
            };
            self.image.src = self.url;
        }));
    };

    return ImageResource;
});