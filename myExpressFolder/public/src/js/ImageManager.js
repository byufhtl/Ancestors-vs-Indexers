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
                ImageManager.status = "Loading images...";
                ++ImageManager.total;
                ImageManager.map[key] = new ImageResource(key, url);
                ImageManager.map[key].getImage().then(function(response){
                    ImageManager[key] = key;
                    ++ImageManager.tot_loaded;
                    ImageManager.status = "Loaded.";
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
            ImageManager.total = 21;
            ImageManager.tot_loaded = 0;
            ImageManager.map[ImageManager.TRI_ALPH] = new ImageResource(ImageManager.TRI_ALPH, "src/img/field/triangleAlpha.png");
            ImageManager.map[ImageManager.TRI_B] = new ImageResource(ImageManager.TRI_B, "src/img/field/triangleBeta.png");
            ImageManager.map[ImageManager.NODE] = new ImageResource(ImageManager.NODE, "src/img/field/node.png");
            ImageManager.map[ImageManager.UND_TREE] = new ImageResource(ImageManager.UND_TREE, "src/img/field/underlayTree.png");

            ImageManager.map[ImageManager.GM_BKGRD] = new ImageResource(ImageManager.GM_BKGRD, "src/img/background.png");
            ImageManager.map[ImageManager.GM_FRGRD] = new ImageResource(ImageManager.GM_FRGRD, "src/img/lightbeam.png");
            ImageManager.map[ImageManager.GM_VCTRY] = new ImageResource(ImageManager.GM_VCTRY, "src/img/victory.jpg");
            ImageManager.map[ImageManager.GM_DFEAT] = new ImageResource(ImageManager.GM_DFEAT, "src/img/defeat.jpg");

            ImageManager.map[ImageManager.REC_BLUE] = new ImageResource(ImageManager.REC_BLUE, "src/img/records/blueRecord.png");
            ImageManager.map[ImageManager.REC_BRWN] = new ImageResource(ImageManager.REC_BRWN, "src/img/records/brownRecord.png");
            ImageManager.map[ImageManager.REC_GOLD] = new ImageResource(ImageManager.REC_GOLD, "src/img/records/goldenRecord.png");
            ImageManager.map[ImageManager.REC_GREN] = new ImageResource(ImageManager.REC_GREN, "src/img/records/greenRecord.png");
            ImageManager.map[ImageManager.REC_ORNG] = new ImageResource(ImageManager.REC_ORNG, "src/img/records/orangeRecord.png");
            ImageManager.map[ImageManager.REC_VLET] = new ImageResource(ImageManager.REC_VLET, "src/img/records/violetRecord.png");
            ImageManager.map[ImageManager.REC_TRNS] = new ImageResource(ImageManager.REC_TRNS, "src/img/records/emptyRecord.png");

            ImageManager.map[ImageManager.STAN_IDX] = new ImageResource(ImageManager.STAN_IDX, "src/img/indexers/bow-indexer.png");
            ImageManager.map[ImageManager.HOBB_IDX] = new ImageResource(ImageManager.HOBB_IDX, "src/img/indexers/hobbyist.png");
            ImageManager.map[ImageManager.UBER_IDX] = new ImageResource(ImageManager.UBER_IDX, "src/img/indexers/tree.png");

            ImageManager.map[ImageManager.BLD_FHCR] = new ImageResource(ImageManager.BLD_FHCR, "src/img/buildings/drake1-A01.png");
            ImageManager.map[ImageManager.BLD_LIBR] = new ImageResource(ImageManager.BLD_LIBR, "src/img/buildings/human-city4.png");

            ImageManager.map[ImageManager.ANC_STAN] = new ImageResource(ImageManager.ANC_STAN, "src/img/ancestors/animAnc.png");
            ImageManager.map[ImageManager.ANC_NMLS] = new ImageResource(ImageManager.ANC_NMLS, "src/img/ancestors/nameless.png");

            //console.log("Looping:");
            for(var property in ImageManager.map){
                if(ImageManager.map.hasOwnProperty(property)) {
                    //console.log(ImageManager.map[property]);
                    ImageManager.map[property].getImage().then(function (response) {
                        if (++ImageManager.tot_loaded == ImageManager.total) {
                            ImageManager.status = "Loaded.";
                            resolve(ImageManager);
                        }
                    },
                    function(e){
                        console.log("Image could not load...");
                        reject(e);
                    });
                }
                else{
                    console.log(property);
                }
            }

        });
    };

    ImageManager.TRI_ALPH  = "triangle_alpha";
    ImageManager.TRI_B  = "tri_beta";
    ImageManager.NODE   = "node";
    ImageManager.UND_TREE = "underlay_tree";

    ImageManager.GM_BKGRD   = "background";
    ImageManager.GM_FRGRD   = "foreground";
    ImageManager.GM_VCTRY   = "victory";
    ImageManager.GM_DFEAT   = "defeat";

    ImageManager.REC_BLUE = "rec_blue";
    ImageManager.REC_BRWN = "rec_brown";
    ImageManager.REC_GOLD = "rec_golden";
    ImageManager.REC_GREN = "rec_green";
    ImageManager.REC_ORNG = "rec_orange";
    ImageManager.REC_RED_ = "rec_red";
    ImageManager.REC_VLET = "rec_violet";
    ImageManager.REC_TRNS = "rec_empty";

    ImageManager.STAN_IDX = "idx_standard";
    ImageManager.HOBB_IDX = "idx_hobbyist";
    ImageManager.UBER_IDX = "idx_uber";

    ImageManager.BLD_FHCR = "build_fhcenter";
    ImageManager.BLD_LIBR = "library";

    ImageManager.ANC_STAN = "anc_standard";
    ImageManager.ANC_NMLS = "anc_nameless";



    return ImageManager;
});
