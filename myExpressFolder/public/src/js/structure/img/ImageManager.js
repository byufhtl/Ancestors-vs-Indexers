/**
 * Created by calvinmcm on 6/27/16.
 */

define(["ImageResource","structure/util/Order"], function(ImageResource, Order){

    /**
     * The primary image manager for the program. Maintains a list of resources and loads them as necessary.
     * Class is designed with no specific prototype.
     * @constructor
     */
    function ImageManager(){
        this.loader = new LoaderUtils();
    }

    // ENTRY POINTS ====================================================================================================

    /**
     * Allows for a different LoaderUtils to be loaded, allowing us to take full advantage of prior file saving.
     * @param loader
     */
    HTMLManager.prototype.injectLoader = function(loader){
        this.loader = loader;
    };

    /**
     * Allows the LoaderUtils for this class to be extracted and stored externally, allowing us to preserve loaded
     * files across several instances of the HTMLManager class if properly handled.
     * @returns {*}
     */
    HTMLManager.prototype.extractLoader = function(){
        return this.loader;
    };

    /**
     * A quick check to see if an image is loaded.
     * @param url the key associated with the desired image.
     * @returns {boolean}
     */
    ImageManager.isLoaded = function(url){
        return this.loader.hasResource(url)
    };

    /**
     * Retrieves an image if it has loaded, otherwise returns null.
     * @param url the key associated with the desired image.
     * @returns {Image}
     */
    ImageManager.getImage = function(url){
        return this.loader.getResource(url);
    };

    /**
     * Launches the image manager, returning a promise that is resolved once all of the images have loaded up.
     * The resolution response is the last image to load - in case you happen to be interested in that for any reason.
     * @returns {Promise}
     */
    ImageManager.launch = function(area){

        ImageManager.status = "Loading images...";
        switch(area){
            case "field":
                return ImageManager.loadFieldPieces();
                break;
            case "background":
                return ImageManager.loadBackgroundSkins();
                break;
            case "records":
                return ImageManager.loadRecordSprites();
                break;
            case "indexers":
                return ImageManager.loadIndexerSprites();
                break;
            case "buildings":
                return ImageManager.loadBuildingSprites();
                break;
            case "ancestors":
                return ImageManager.loadAncestorSprites();
                break;
            default:
                return ImageManager.loadFieldPieces();
                return ImageManager.loadBackgroundSkins();
                return ImageManager.loadRecordSprites();
                return ImageManager.loadIndexerSprites();
                return ImageManager.loadBuildingSprites();
                return ImageManager.loadAncestorSprites();
        }
    };

    /**
     * Validates a given map or ImageResources, loading the images and placing them in the ImageManager.map
     * @param map A map of ImageResources
     * @param size the number of ImageResources in the map.
     * @returns {Promise}
     */
    ImageManager.validate = function(map, size){
        return new Promise(function(resolve, reject){
            var count = 0;
            for(var prop in map){
                if(map.hasOwnProperty(prop)){
                    if(ImageManager.isLoaded(prop)){ // don't load it up again if it's already loaded.
                        if(++count == size){
                            resolve(true);
                        }
                    }
                    else {
                        map[prop].getImage().then(function (response) {
                                ImageManager.map[prop] = map[prop];
                                if (++ImageManager.tot_loaded == ImageManager.total) {
                                    ImageManager.status = "Loaded.";
                                }
                                if (++count == size) {
                                    resolve(true);
                                }
                            },
                            function (e) {
                                console.log("Image could not load...");
                                reject();
                            }
                        );
                    }
                }
            }
        });
    };

    /**
     * Loads a new image with the key and url specified.
     * Returns a promise that is resolved once the image is loaded.
     * Promise is rejected if the key matches an existing property on the ImageLoader, or the image fails to load.
     * @param key
     * @param url
     * @returns {Promise}
     */
    ImageManager.loadNew = function(key, url){var map = {};
        var map = {};
        ImageManager.total += 1;
        return new Promise(function(resolve, reject){
            ImageManager.map[key] = new ImageResource(key, url);

            ImageManager.validate(map, 1).then(function(response){
                    resolve(response);
                },
                function(response){
                    reject();
                })
        });
    };
    
    ImageManager.loadFieldPieces = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.TRI_ALPH, Order.IMAGE, 15);
            order.addItem(ImageManager.TRI_BETA, Order.IMAGE, 15);
            order.addItem(ImageManager.NODE_CIR, Order.IMAGE, 15);
            order.addItem(ImageManager.UND_TREE, Order.IMAGE, 15);
            self.loader.loadResources(Order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.loadBackgroundSkins = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.GM_BKGRD, Order.IMAGE, 15);
            order.addItem(ImageManager.GM_FRGRD, Order.IMAGE, 15);
            order.addItem(ImageManager.GM_VCTRY, Order.IMAGE, 15);
            order.addItem(ImageManager.GM_DFEAT, Order.IMAGE, 15);
            self.loader.loadResources(Order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.loadRecordSprites = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.REC_BLUE, Order.IMAGE, 15);
            order.addItem(ImageManager.REC_BRWN, Order.IMAGE, 15);
            order.addItem(ImageManager.REC_GOLD, Order.IMAGE, 15);
            order.addItem(ImageManager.REC_GREN, Order.IMAGE, 15);
            order.addItem(ImageManager.REC_ORNG, Order.IMAGE, 15);
            order.addItem(ImageManager.REC_RED , Order.IMAGE, 15);
            order.addItem(ImageManager.REC_VLET, Order.IMAGE, 15);
            order.addItem(ImageManager.REC_TRNS, Order.IMAGE, 15);
            self.loader.loadResources(Order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.loadIndexerSprites = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.STAN_IDX, Order.IMAGE, 15);
            order.addItem(ImageManager.HOBB_IDX, Order.IMAGE, 15);
            order.addItem(ImageManager.UBER_IDX, Order.IMAGE, 15);
            self.loader.loadResources(Order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.loadBuildingSprites = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.BLD_FHCR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLD_LIBR, Order.IMAGE, 15);
            self.loader.loadResources(Order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.loadAncestorSprites = function(){

        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.ANC_STAN, Order.IMAGE, 15);
            order.addItem(ImageManager.ANC_NMLS, Order.IMAGE, 15);
            self.loader.loadResources(Order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.TRI_ALPH =     "src/img/field/triangleAlpha.png";          // TRIANGLE ALPHA
    ImageManager.TRI_BETA =     "src/img/field/triangleBeta.png";           // TRIANGLE BETA
    ImageManager.NODE_CIR =     "src/img/field/node.png";                   // NODE CIRCLE
    ImageManager.UND_TREE =     "src/img/field/underlayTree.png";           // UNDERLAY TREE

    ImageManager.GM_BKGRD =     "src/img/background.png";                   // GAME BACKGROUND
    ImageManager.GM_FRGRD =     "src/img/lightbeam.png";                    // GAME FOREGROUND
    ImageManager.GM_VCTRY =     "src/img/victory.jpg";                      // VICTORY SCREEN
    ImageManager.GM_DFEAT =     "src/img/defeat.jpg";                       // DEFEAT SCREEN

    ImageManager.REC_BLUE =     "src/img/records/blueRecord.png";           // BLUE RECORD
    ImageManager.REC_BRWN =     "src/img/records/brownRecord.png";          // BROWN RECORD
    ImageManager.REC_GOLD =     "src/img/records/goldenRecord.png";         // GOLDEN RECORD
    ImageManager.REC_GREN =     "src/img/records/greenRecord.png";          // GREEN RECORD
    ImageManager.REC_ORNG =     "src/img/records/orangeRecord.png";         // ORANGE RECORD
    ImageManager.REC_RED  =     "src/img/records/redRecord.png";            // RED RECORD
    ImageManager.REC_VLET =     "src/img/records/violetRecord.png";         // VIOLET RECORD
    ImageManager.REC_TRNS =     "src/img/records/emptyRecord.png";          // TRANSPARENT RECORD

    ImageManager.STAN_IDX =     "src/img/indexers/bow-indexer.png";         // STANDARD INDEXER
    ImageManager.HOBB_IDX =     "src/img/indexers/hobbyist.png";            // HOBBYIST INDEXER
    ImageManager.UBER_IDX =     "src/img/indexers/tree.png";                // TREE INDEXER

    ImageManager.BLD_FHCR =     "src/img/buildings/drake1-A01.png";         // FAMILY HISTORY CENTER
    ImageManager.BLD_LIBR =     "src/img/buildings/human-city4.png";        // LIBRARY

    ImageManager.ANC_STAN =     "src/img/ancestors/peasant.png";            // STANDARD ANCESTOR
    ImageManager.ANC_NMLS =     "src/img/ancestors/nameless.png";           // NAMELESS ANCESTOR


    return ImageManager;
});
