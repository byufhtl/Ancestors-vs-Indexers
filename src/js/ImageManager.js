/**
 * Created by calvinmcm on 6/27/16.
 */

define(["ImageResource"], function(ImageResource){

    /**
     * The primary image manager for the program. Maintains a list of resources and loads them as necessary.
     * Class is designed with no specific prototype.
     * @constructor
     */
    function ImageManager(){}

    ImageManager.map = {};
    ImageManager.status = "new";
    ImageManager.total = 0;
    ImageManager.tot_loaded = 0;

    /**
     * A quick check to see if an image is loaded.
     * @param key the key associated with the desired image.
     * @returns {boolean}
     */
    ImageManager.isLoaded = function(key){
        if(ImageManager.map.hasOwnProperty(key)){
            return ImageManager.map[key].loaded;
        }
    };

    /**
     * Retrieves an image if it has loaded, otherwise returns null.
     * @param key the key associated with the desired image.
     * @returns {Image}
     */
    ImageManager.getImage = function(key){
        return(ImageManager.isLoaded(key) ? ImageManager.map[key].image : null);
    };

    /**
     * Loads a new image with the key and url specified.
     * Returns a promise that is resolved once the image is loaded.
     * Promise is rejected if the key matches an existing property on the ImageLoader
     * @param key
     * @param url
     * @returns {Promise}
     */
    ImageManager.loadNew = function(key, url){
        return new Promise(function(resolve, reject){
            if(!ImageManager.hasOwnProperty(key)){ // If image loader does not already have the property installed.
                ++ImageManager.total;
                ImageManager.map[key] = new ImageResource(key, url);
                ImageManager.map[key].getImage().then(function(response){
                    ImageManager[key] = key;
                    ++ImageManager.tot_loaded;
                    resolve(response);
                })
            }
            else{reject();}
        })
    };

    /**
     * Launches the image manager, returning a promise that is resolved once all of the images have loaded up.
     * The resolution response is the last image to load - in case you happen to be interested in that for any reason.
     * @returns {Promise}
     */
    ImageManager.launch = function(){

        return new Promise(function(resolve, reject){
            ImageManager.status = "Loading images...";
            ImageManager.total = 18;
            ImageManager.tot_loaded = 0;
            ImageManager.map[ImageManager.BKGD] = new ImageResource(ImageManager.BKGD, "src/img/background.png");
            ImageManager.map[ImageManager.FRGD] = new ImageResource(ImageManager.FRGD, "src/img/lightbeam.png");
            ImageManager.map[ImageManager.VCTR] = new ImageResource(ImageManager.VCTR, "src/img/victory.jpg");
            ImageManager.map[ImageManager.DFET] = new ImageResource(ImageManager.DFET, "src/img/defeat.jpg");

            ImageManager.map[ImageManager.REC_BL] = new ImageResource(ImageManager.REC_BL, "src/img/records/blueRecord.png");
            ImageManager.map[ImageManager.REC_BR] = new ImageResource(ImageManager.REC_BR, "src/img/records/brownRecord.png");
            ImageManager.map[ImageManager.REC_GD] = new ImageResource(ImageManager.REC_GD, "src/img/records/goldenRecord.png");
            ImageManager.map[ImageManager.REC_GR] = new ImageResource(ImageManager.REC_GR, "src/img/records/greenRecord.png");
            ImageManager.map[ImageManager.REC_OR] = new ImageResource(ImageManager.REC_OR, "src/img/records/orangeRecord.png");
            ImageManager.map[ImageManager.REC_VT] = new ImageResource(ImageManager.REC_VT, "src/img/records/violetRecord.png");
            ImageManager.map[ImageManager.REC_EM] = new ImageResource(ImageManager.REC_EM, "src/img/records/emptyRecord.png");

            ImageManager.map[ImageManager.IDX_STAN] = new ImageResource(ImageManager.IDX_STAN, "src/img/indexers/bow-indexer.png");
            ImageManager.map[ImageManager.IDX_STAN] = new ImageResource(ImageManager.IDX_STAN, "src/img/indexers/hobbyist.png");

            ImageManager.map[ImageManager.BLD_FHCR] = new ImageResource(ImageManager.BLD_FHCR, "src/img/buildings/drake1-A01.png");
            ImageManager.map[ImageManager.BLD_LIBR] = new ImageResource(ImageManager.BLD_LIBR, "src/img/buildings/human-city4.png");

            ImageManager.map[ImageManager.ANC_STAN] = new ImageResource(ImageManager.ANC_STAN, "src/img/ancestors/peasant.png");

            for(var i = 0; i < ImageManager.map.length; i++){
                ImageManager.map[i].getImage().then(function(response){
                    ImageManager.tot_loaded++;
                    if(ImageManager.tot_loaded == ImageManager.total){
                        resolve(ImageManager);
                    }
                });
            }

        });
    };

    ImageManager.BKGD = "background";
    ImageManager.FRGD = "foreground";
    ImageManager.VCTR = "victory";
    ImageManager.DFET = "defeat";

    ImageManager.REC_BL = "rec_blue";
    ImageManager.REC_BR = "rec_brown";
    ImageManager.REC_GD = "rec_golden";
    ImageManager.REC_GR = "rec_green";
    ImageManager.REC_OR = "rec_orange";
    ImageManager.REC_RD = "rec_red";
    ImageManager.REC_VT = "rec_violet";
    ImageManager.REC_EM = "rec_empty";

    ImageManager.IDX_STAN = "idx_standard";
    ImageManager.IDX_HOBB = "idx_hobbyist";

    ImageManager.BLD_FHCR = "build_fhcenter";
    ImageManager.BLD_LIBR = "library";

    ImageManager.ANC_STAN = "anc_standard";


    return ImageManager;
});