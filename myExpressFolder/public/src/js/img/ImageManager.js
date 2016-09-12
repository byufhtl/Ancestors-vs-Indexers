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

        self.status = "Loading Image Package";
        console.log("<<PACKAGE MANAGER>>", self.status, "[" + area + "].");
        switch(area){
            case Sig.FLD_IMGS:
                return self.loadBoardTiles();
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
            order.addItem(ImageManager.BKGD_IMG, Order.IMAGE, 15);
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
            order.addItem(ImageManager.VRS_FORE, Order.IMAGE, 15);
            order.addItem(ImageManager.VRS_BACK, Order.IMAGE, 15);
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
            order.addItem(ImageManager.ANC_MOTR, Order.IMAGE, 15);
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

    ImageManager.prototype.loadStoryTellerSprites = function(){
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;
            order.addItem(ImageManager.STY_TELL, Order.IMAGE, 15);
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

    ImageManager.prototype.loadButtonsImgs = function() {
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;

            order.addItem(ImageManager.MAIN_BTN, Order.IMAGE, 15);
            order.addItem(ImageManager.NEXT_BTN, Order.IMAGE, 15);
            order.addItem(ImageManager.AGAN_BTN, Order.IMAGE, 15);

            order.addItem(ImageManager.BLDG_BTN, Order.IMAGE, 15);
            order.addItem(ImageManager.PEPL_BTN, Order.IMAGE, 15);
            order.addItem(ImageManager.SPCL_BTN, Order.IMAGE, 15);

            order.addItem(ImageManager.INDX_BTN, Order.IMAGE, 15);
            order.addItem(ImageManager.RSCH_BTN, Order.IMAGE, 15);
            order.addItem(ImageManager.SPCT_BTN, Order.IMAGE, 15);

            order.addItem(ImageManager.STRY_BTN, Order.IMAGE, 15);
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

    ImageManager.prototype.loadBoardTiles = function() {
        var self = this;
        return new Promise(function(resolve, reject){
            var order = new Order;

            order.addItem(ImageManager.BLU_BL, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_BLR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_BR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_LR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_TB, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_TBL, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_TBLR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_TBR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_TL, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_TLR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_TR, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_T, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_B, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_L, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_R, Order.IMAGE, 15);
            order.addItem(ImageManager.BLU_ISLD, Order.IMAGE, 15);
            order.addItem(ImageManager.STRT_POS, Order.IMAGE, 15);
            order.addItem(ImageManager.DTB_TILE, Order.IMAGE, 15);
            order.addItem(ImageManager.CRK_TILE, Order.IMAGE, 15);
            order.addItem(ImageManager.SPD_TILE, Order.IMAGE, 15);
            order.addItem(ImageManager.LCK_TILE, Order.IMAGE, 15);
            order.addItem(ImageManager.RLF_COIN, Order.IMAGE, 15);
            order.addItem(ImageManager.VIP_COIN, Order.IMAGE, 15);
            order.addItem(ImageManager.OPG_COIN, Order.IMAGE, 15);
            order.addItem(ImageManager.GMP_COIN, Order.IMAGE, 15);
            order.addItem(ImageManager.GNP_COIN, Order.IMAGE, 15);
            order.addItem(ImageManager.KEY_ICON, Order.IMAGE, 15);

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
            self.loadStoryTellerSprites().then(partialResolve,
                function(rejection){
                    console.log("Loading the ancestors claims to have failed...");
                    failed.push(Sig.STY_TELL);
                    partialResolve();
                }
            );
            self.loadButtonsImgs().then(partialResolve,
                function(rejection){
                    console.log("Loading the buttons claims to have failed...");
                    failed.push(Sig.STY_TELL);
                    partialResolve();
                }
            );
            self.loadBoardTiles().then(partialResolve,
                function(rejection){
                    console.log("Loading the board tiles claims to have failed...");
                    failed.push(Sig.FLD_IMGS);
                    partialResolve();
                }
            );
        });
    };


    ImageManager.BLU_BL   =     "src/img/GameTiles/bl.png";                 // BOTTOM LEFT TILE
    ImageManager.BLU_BLR  =     "src/img/GameTiles/blr.png";                // BOTTOM LEFT RIGHT TILE
    ImageManager.BLU_BR   =     "src/img/GameTiles/br.png";                 // BOTTOM RIGHT TILE
    ImageManager.BLU_LR   =     "src/img/GameTiles/lr.png";                 // LEFT RIGHT TILE
    ImageManager.BLU_TB   =     "src/img/GameTiles/tb.png";                 // TOP BOTTOM TILE
    ImageManager.BLU_TBL  =     "src/img/GameTiles/tbl.png";                // TOP BOTTOM LEFT TILE
    ImageManager.BLU_TBLR =     "src/img/GameTiles/tblr.png";               // TOP BOTTOM LEFT RIGHT TILE
    ImageManager.BLU_TBR  =     "src/img/GameTiles/tbr.png";                // TOP BOTTOM  RIGHT TILE
    ImageManager.BLU_TL   =     "src/img/GameTiles/tl.png";                 // TOP LEFT TILE
    ImageManager.BLU_TLR  =     "src/img/GameTiles/tlr.png";                // TOP LEFT RIGHT TILE
    ImageManager.BLU_TR   =     "src/img/GameTiles/tr.png";                 // TOP RIGHT TILE
    ImageManager.BLU_T    =     "src/img/GameTiles/t.png";                  // TOP TILE
    ImageManager.BLU_B    =     "src/img/GameTiles/b.png";                  // BOTTOM TILE
    ImageManager.BLU_L    =     "src/img/GameTiles/l.png";                  // LEFT TILE
    ImageManager.BLU_R    =     "src/img/GameTiles/r.png";                  // RIGHT TILE
    ImageManager.BLU_ISLD =     "src/img/GameTiles/island.png";             // ISLAND TILE (disconnected)

    ImageManager.STRT_POS =     "src/img/GameTiles/startingPoint.png";      // STARTING POINT
    ImageManager.DTB_TILE =     "src/img/GameTiles/DBTile.png";             // DATABASE TILE
    ImageManager.CRK_TILE =     "src/img/GameTiles/fragile.png";            // CRACKED/FRAGILE TILE
    ImageManager.SPD_TILE =     "src/img/GameTiles/HighSpeed.png";          // HIGH-SPEED TILE
    ImageManager.LCK_TILE =     "src/img/GameTiles/locked.png";             // LOCK TILE



    ImageManager.RLF_COIN =     "src/img/GameTiles/rfCoin.png";             // RELATIVEFINDER COIN
    ImageManager.VIP_COIN =     "src/img/GameTiles/vpCoin.png";             // VIRTUAL PEDIGREE COIN
    ImageManager.OPG_COIN =     "src/img/GameTiles/opgCoin.png";            // ONE PAGE GENEALOGY COIN
    ImageManager.GMP_COIN =     "src/img/GameTiles/gpCoin.png";             // GRANDMAS PIE COIN
    ImageManager.GNP_COIN =     "src/img/GameTiles/gnpdyCoin.png";          // GENEOPARDY COIN

    ImageManager.KEY_ICON =     "src/img/GameTiles/key.png";                // KEY FOR UNLOCKING LOCKED TILES

    ImageManager.VRS_FORE =     "src/img/Virus/CompVirusForward.png";       // VIRUS - FRONT FACING
    ImageManager.VRS_BACK =     "src/img/Virus/CompVirusBack.png";          // VIRUS - REAR FACING

    ImageManager.TRI_ALPH =     "src/img/field/triangleAlpha.png";          // TRIANGLE ALPHA
    ImageManager.TRI_BETA =     "src/img/field/triangleBeta.png";           // TRIANGLE BETA
    ImageManager.NODE_CIR =     "src/img/field/Nodes/node_blue.png";        // NODE CIRCLE
    ImageManager.UND_TREE =     "src/img/field/underlay.png";               // UNDERLAY TREE

    ImageManager.BKGD_IMG =     "src/img/field/Backdrop.png";               // BACKDROP IMAGE
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
    ImageManager.ANC_MOTR =     "src/img/ancestors/Ghostorist.png";        // MOTORCYCLE ANCESTOR

    ImageManager.STY_TELL =     "src/img/Storyteller.png";                  // STORY TELLER

    ImageManager.PEPL_BTN =     "src/img/buttons/PeopleButton.png";         // INDEXERS BUTTON
    ImageManager.BLDG_BTN =     "src/img/buttons/BuildingsButton.png";      // BUILDINGS BUTTON
    ImageManager.SPCL_BTN =     "src/img/buttons/SpecialsButton.png";       // SPECIALS BUTTON

    ImageManager.INDX_BTN =     "src/img/buttons/People/IndexerButton.png"; // INDEXERS BUTTON
    ImageManager.RSCH_BTN =     "src/img/buttons/People/ResearchersButton.png"; // RESEARCHERS BUTTON
    ImageManager.SPCT_BTN =     "src/img/buttons/People/SpecialistsButton.png"; // SPECIALIST BUTTON

    ImageManager.STRY_BTN =     "src/img/buttons/Specials/StorytellerButton.png"; //STORYTELLER BUTTON

    ImageManager.MAIN_BTN =     "src/img/buttons/MainMenuButton.png";       // MAIN MENU BUTTON
    ImageManager.NEXT_BTN =     "src/img/buttons/NextLevelButton.png";      // NEXT LEVEL BUTTON
    ImageManager.AGAN_BTN =     "src/img/buttons/PlayAgainButton.png";      // PLAY AGAIN BUTTON

    return ImageManager;
});
