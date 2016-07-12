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
        var map = {};
        ImageManager.total += 4;
        return new Promise(function(resolve, reject){
            map[ImageManager.TRI_A] = new ImageResource(ImageManager.TRI_A, "src/img/field/triangleAlpha.png");
            map[ImageManager.TRI_B] = new ImageResource(ImageManager.TRI_B, "src/img/field/triangleBeta.png");
            map[ImageManager.NODE] = new ImageResource(ImageManager.NODE, "src/img/field/node.png");
            map[ImageManager.UND_TREE] = new ImageResource(ImageManager.UND_TREE, "src/img/field/underlayTree.png");

            ImageManager.validate(map, 4).then(function(response){
                resolve(response);
            },
            function(response){
                reject();
            })
        })
    };

    ImageManager.loadBackgroundSkins = function(){
        var map = {};
        ImageManager.total += 4;
        return new Promise(function(resolve, reject){
            map[ImageManager.BKGD] = new ImageResource(ImageManager.BKGD, "src/img/background.png");
            map[ImageManager.FRGD] = new ImageResource(ImageManager.FRGD, "src/img/lightbeam.png");
            map[ImageManager.VCTR] = new ImageResource(ImageManager.VCTR, "src/img/victory.jpg");
            map[ImageManager.DFET] = new ImageResource(ImageManager.DFET, "src/img/defeat.jpg");

            ImageManager.validate(map, 4).then(function(response){
                    resolve(response);
                },
                function(response){
                    reject();
                })
        })
    };

    ImageManager.loadRecordSprites = function(){
        var map = {};
        ImageManager.total += 7;
        return new Promise(function(resolve, reject){
            ImageManager.map[ImageManager.REC_BL] = new ImageResource(ImageManager.REC_BL, "src/img/records/blueRecord.png");
            ImageManager.map[ImageManager.REC_BR] = new ImageResource(ImageManager.REC_BR, "src/img/records/brownRecord.png");
            ImageManager.map[ImageManager.REC_GD] = new ImageResource(ImageManager.REC_GD, "src/img/records/goldenRecord.png");
            ImageManager.map[ImageManager.REC_GR] = new ImageResource(ImageManager.REC_GR, "src/img/records/greenRecord.png");
            ImageManager.map[ImageManager.REC_OR] = new ImageResource(ImageManager.REC_OR, "src/img/records/orangeRecord.png");
            ImageManager.map[ImageManager.REC_VT] = new ImageResource(ImageManager.REC_VT, "src/img/records/violetRecord.png");
            ImageManager.map[ImageManager.REC_EM] = new ImageResource(ImageManager.REC_EM, "src/img/records/emptyRecord.png");

            ImageManager.validate(map, 7).then(function(response){
                    resolve(response);
                },
                function(response){
                    reject();
                })
        })
    };

    ImageManager.loadIndexerSprites = function(){
        var map = {};
        ImageManager.total += 3;
        return new Promise(function(resolve, reject){
            ImageManager.map[ImageManager.STAN_IDX] = new ImageResource(ImageManager.STAN_IDX, "src/img/indexers/bow-indexer.png");
            ImageManager.map[ImageManager.HOBB_IDX] = new ImageResource(ImageManager.HOBB_IDX, "src/img/indexers/hobbyist.png");
            ImageManager.map[ImageManager.UBER_IDX] = new ImageResource(ImageManager.UBER_IDX, "src/img/indexers/tree.png");

            ImageManager.validate(map, 3).then(function(response){
                    resolve(response);
                },
                function(response){
                    reject();
                })
        })
    };

    ImageManager.loadBuildingSprites = function(){
        var map = {};
        ImageManager.total += 2;
        return new Promise(function(resolve, reject){
            ImageManager.map[ImageManager.BLD_FHCR] = new ImageResource(ImageManager.BLD_FHCR, "src/img/buildings/drake1-A01.png");
            ImageManager.map[ImageManager.BLD_LIBR] = new ImageResource(ImageManager.BLD_LIBR, "src/img/buildings/human-city4.png");

            ImageManager.validate(map, 2).then(function(response){
                    resolve(response);
                },
                function(response){
                    reject();
                })
        })
    };

    ImageManager.loadAncestorSprites = function(){
        var map = {};
        ImageManager.total += 2;
        return new Promise(function(resolve, reject){
            ImageManager.map[ImageManager.ANC_STAN] = new ImageResource(ImageManager.ANC_STAN, "src/img/ancestors/peasant.png");
            ImageManager.map[ImageManager.ANC_NMLS] = new ImageResource(ImageManager.ANC_NMLS, "src/img/ancestors/nameless.png");

            ImageManager.validate(map, 2).then(function(response){
                    resolve(response);
                },
                function(response){
                    reject();
                })
        });
    };

    ImageManager.TRI_A  = "triangle_alpha";
    ImageManager.TRI_B  = "tri_beta";
    ImageManager.NODE   = "node";
    ImageManager.UND_TREE = "underlay_tree";

    ImageManager.BKGD   = "background";
    ImageManager.FRGD   = "foreground";
    ImageManager.VCTR   = "victory";
    ImageManager.DFET   = "defeat";

    ImageManager.REC_BL = "rec_blue";
    ImageManager.REC_BR = "rec_brown";
    ImageManager.REC_GD = "rec_golden";
    ImageManager.REC_GR = "rec_green";
    ImageManager.REC_OR = "rec_orange";
    ImageManager.REC_RD = "rec_red";
    ImageManager.REC_VT = "rec_violet";
    ImageManager.REC_EM = "rec_empty";

    ImageManager.STAN_IDX = "idx_standard";
    ImageManager.HOBB_IDX = "idx_hobbyist";
    ImageManager.UBER_IDX = "idx_hobbyist";

    ImageManager.BLD_FHCR = "build_fhcenter";
    ImageManager.BLD_LIBR = "library";

    ImageManager.ANC_STAN = "anc_standard";
    ImageManager.ANC_NMLS = "anc_nameless";


    return ImageManager;
});
