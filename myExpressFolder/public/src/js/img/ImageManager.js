/**
 * Created by calvinmcm on 6/27/16.
 */

define(["../util/Order", "util/Sig", "util/LoaderUtils"], function(Order, Sig, LoaderUtils){

    /**
     * The primary image manager for the program. Maintains a list of resources and loads them as necessary.
     * Class is designed with no specific prototype.
     * @constructor
     */
    function ImageManager(){
        this.loader = new LoaderUtils();
        this.status = "new";
    }

    ImageManager.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case Sig.CMND_ACT:
                return self.obeyCommand(event.value, data);
                break;
            case Sig.LD_IMGST:
                return self.launch(event.value);
                break;
            case Sig.FTCH_IMG:
                return self.getImage(event.value);
                break;
            default:
                console.log("ImageManager could not properly handle event:", event);
        }
    };

    // ENTRY POINTS ====================================================================================================

    ImageManager.prototype.obeyCommand = function(value, data){
        switch(value){
            case Sig.GET_LODR:
                return this.extractLoader();
                break;
            case Sig.SET_LODR:
                return this.injectLoader(data.loader);
                break;
        }
    };

    /**
     * Allows for a different LoaderUtils to be loaded, allowing us to take full advantage of prior file saving.
     * @param loader
     */
    ImageManager.prototype.injectLoader = function(loader){
        this.loader = loader;
    };

    /**
     * Allows the LoaderUtils for this class to be extracted and stored externally, allowing us to preserve loaded
     * files across several instances of the HTMLManager class if properly handled.
     * @returns {*}
     */
    ImageManager.prototype.extractLoader = function(){
        return this.loader;
    };

    /**
     * A quick check to see if an image is loaded.
     * @param url the key associated with the desired image.
     * @returns {boolean}
     */
    ImageManager.prototype.isLoaded = function(url){
        return this.loader.hasResource(url)
    };

    /**
     * Retrieves an image if it has loaded, otherwise returns null.
     * @param url the key associated with the desired image.
     * @returns {Image}
     */
    ImageManager.prototype.getImage = function(url){
        return this.loader.getResource(url);
    };

    /**
     * Launches the image manager, returning a promise that is resolved once all of the images have loaded up.
     * The resolution response is the last image to load - in case you happen to be interested in that for any reason.
     * @returns {Promise}
     */
    ImageManager.prototype.launch = function(area){
        var self = this;

        self.status = "Loading images...";
        console.log(self.status, area);
        switch(area){
            case Sig.FLD_IMGS:
                return self.loadFieldPieces();
                break;
            case Sig.BKG_IMGS:
                return self.loadBackgroundSkins();
                break;
            case Sig.REC_IMGS:
                return self.loadRecordSprites();
                break;
            case Sig.IND_IMGS:
                return self.loadIndexerSprites();
                break;
            case Sig.BLD_IMGS:
                return self.loadBuildingSprites();
                break;
            case Sig.ANC_IMGS:
                return self.loadAncestorSprites();
                break;
            case Sig.ALL_IMGS:
                return self.loadAll();
                break;
        }
    };

    ImageManager.prototype.loadFieldPieces = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.TRI_ALPH, Order.IMAGE, 15);
            order.addItem(ImageManager.TRI_BETA, Order.IMAGE, 15);
            order.addItem(ImageManager.NODE_CIR, Order.IMAGE, 15);
            order.addItem(ImageManager.UND_TREE, Order.IMAGE, 15);
            self.loader.loadResources(order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.prototype.loadBackgroundSkins = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            // order.addItem(ImageManager.GM_BKGRD, Order.IMAGE, 15);
            // order.addItem(ImageManager.GM_FRGRD, Order.IMAGE, 15);
            order.addItem(ImageManager.GM_VCTRY, Order.IMAGE, 15);
            order.addItem(ImageManager.GM_DFEAT, Order.IMAGE, 15);
            self.loader.loadResources(order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.prototype.loadRecordSprites = function(){
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
            self.loader.loadResources(order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.prototype.loadIndexerSprites = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.STAN_IDX, Order.IMAGE, 15);
            order.addItem(ImageManager.HOBB_IDX, Order.IMAGE, 15);
            order.addItem(ImageManager.UBER_IDX, Order.IMAGE, 15);
            order.addItem(ImageManager.DESK_SML, Order.IMAGE, 15);
            order.addItem(ImageManager.DESK_MED, Order.IMAGE, 15);
            order.addItem(ImageManager.DESK_LRG, Order.IMAGE, 15);
            self.loader.loadResources(order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.prototype.loadBuildingSprites = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.BLD_FHCR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLD_LIBR, Order.IMAGE, 15);
            self.loader.loadResources(order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };

    ImageManager.prototype.loadAncestorSprites = function(){

        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.ANC_STAN, Order.IMAGE, 15);
            order.addItem(ImageManager.ANC_NMLS, Order.IMAGE, 15);
            self.loader.loadResources(order).then(
                function(success){
                    resolve(success);
                },
                function(failure){
                    reject(failure);
                }
            );
        });
    };



    ImageManager.prototype.loadAll = function(){
        var self = this;
        return new Promise(function(resolve, reject) {
            var failed = [];
            var completed = 0;
            function partialResolve(resolution){
                if(++completed == 6){
                    resolve(failed);
                }
            }
            self.loadFieldPieces().then(partialResolve,
                function(rejection){
                    failed.push(Sig.FLD_IMGS);
                    partialResolve();
                }
            );
            self.loadBackgroundSkins().then(partialResolve,
                function(rejection){
                    failed.push(Sig.BKG_IMGS);
                    partialResolve();
                }
            );
            self.loadRecordSprites().then(partialResolve,
                function(rejection){
                    failed.push(Sig.REC_IMGS);
                    partialResolve();
                }
            );
            self.loadIndexerSprites().then(partialResolve,
                function(rejection){
                    failed.push(Sig.IND_IMGS);
                    partialResolve();
                }
            );
            self.loadBuildingSprites().then(partialResolve,
                function(rejection){
                    failed.push(Sig.BLD_IMGS);
                    partialResolve();
                }
            );
            self.loadAncestorSprites().then(partialResolve,
                function(rejection){
                    console.log("Loading the ancestors claims to have failed...");
                    failed.push(Sig.ANC_IMGS);
                    partialResolve();
                }
            );
        });
    };

    ImageManager.TRI_ALPH =     "src/img/field/triangleAlpha.png";          // TRIANGLE ALPHA
    ImageManager.TRI_BETA =     "src/img/field/triangleBeta.png";           // TRIANGLE BETA
    ImageManager.NODE_CIR =     "src/img/field/Nodes/node_blue.png";                   // NODE CIRCLE
    ImageManager.UND_TREE =     "src/img/field/underlayTree.png";           // UNDERLAY TREE

    ImageManager.GM_VCTRY =     "src/img/victory.png";                      // VICTORY SCREEN
    ImageManager.GM_DFEAT =     "src/img/defeat.png";                       // DEFEAT SCREEN

    ImageManager.REC_BLUE =     "src/img/records/blueRecord.png";           // BLUE RECORD
    ImageManager.REC_BRWN =     "src/img/records/brownRecord.png";          // BROWN RECORD
    ImageManager.REC_GOLD =     "src/img/records/goldenRecord.png";         // GOLDEN RECORD
    ImageManager.REC_GREN =     "src/img/records/greenRecord.png";          // GREEN RECORD
    ImageManager.REC_ORNG =     "src/img/records/orangeRecord.png";         // ORANGE RECORD
    ImageManager.REC_RED  =     "src/img/records/redRecord.png";            // RED RECORD
    ImageManager.REC_VLET =     "src/img/records/violetRecord.png";         // VIOLET RECORD
    ImageManager.REC_TRNS =     "src/img/records/emptyRecord.png";          // TRANSPARENT RECORD

    ImageManager.STAN_IDX =     "src/img/indexers/novicesprite.png";        // STANDARD INDEXER
    ImageManager.HOBB_IDX =     "src/img/indexers/hobbyist.png";            // HOBBYIST INDEXER
    ImageManager.UBER_IDX =     "src/img/indexers/tree.png";                // TREE INDEXER

    ImageManager.BLD_FHCR =     "src/img/buildings/FHC.png";                // FAMILY HISTORY CENTER
    ImageManager.BLD_LIBR =     "src/img/buildings/library.png";            // LIBRARY

    ImageManager.DESK_SML =     "src/img/indexers/Desk.png";                // DESK(SMALL)
    ImageManager.DESK_MED =     "src/img/indexers/Desk2.png";               // DESK(MEDIUM)
    ImageManager.DESK_LRG =     "src/img/indexers/Desk3.png";               // DESK(SUPER_COOL)

    ImageManager.ANC_STAN =     "src/img/ancestors/animAnc.png";            // STANDARD ANCESTOR
    ImageManager.ANC_NMLS =     "src/img/ancestors/FarmerSprite.png";       // NAMELESS ANCESTOR

    return ImageManager;
});
