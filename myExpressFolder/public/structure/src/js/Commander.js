/**
 * Created by calvin on 7/8/16.
 */

define(['util/Sig', 'game/GameController','LevelDefinition','game/ViewTransform'],function(Sig, GameController, LevelDefinition, ViewTransform){


    function Commander(imageManager, viewController, king){
        this.king = king;
        this.imageManager = imageManager;
        this.viewController = viewController;
        this.eightGenerations = null;
        this.gameController = null;
        this.levelsController = null;
        this.upgradesController = null;
        this.currentFocusLevel = {act: 1, scene: 1};
        this.userInformation = null;
        this.buttonFocus = this.gameController;
    }

    Commander.prototype.start = function(eightGens){
        var self = this;
        self.viewController.assign(self);
        self.eightGenerations = eightGens;
        // Load up all of the images
        self.imageManager.handle(new Sig(Sig.LD_IMGST, Sig.ALL_IMGS)).then(
            function(failedArray){
                if(failedArray.length){
                    var report = "The Following Image Load Batches Failed to Load: " + failedArray.toString();
                    self.king.handle(new Sig(Sig.SFAILURE), Sig.CRT_FAIL, {report: report});
                }
                else {
                    self.viewController.handle(new Sig(Sig.LD_INTFC, Sig.MM_INTFC)); // Load the Main Menu Interface.
                }
            }
        );
    };

    Commander.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case Sig.FTCH_IMG:
                return self.imageManager.handle(event);
                break;
            case Sig.INTFC_LD:
                switch(event.value){
                    case Sig.START_GM:
                        self.startGame(event.data);
                        break;
                }
                break;
            case Sig.UPD_USER:
                self.updateUser(event);
                break;
            case Sig.LVL_CMND:
                self.handleLevelCommand(event);
                break;
            case Sig.BTN_ACTN:
                if (event.value == Sig.NEXT_BTN) self.nextLevel();
                else if (event.value = Sig.MENU_BTN) self.returnMainMenu();
                else self.buttonFocus.handle(event);
                break;
            case Sig.ST_CLICK:
                self.buttonFocus.handle(event);
                break;
            case Sig.CNVS_CLK:
                self.buttonFocus.handle(event);
                break;
            case Sig.CNVS_DRG:
                self.buttonFocus.handle(event);
                break;
            case Sig.LD_SDBAR:
                self.viewController.handle(event);
                break;
            case Sig.LD_TPBAR:
                self.viewController.handle(event);
                break;
        }
    };

    Commander.prototype.returnMainMenu = function(){
        this.viewController.handle(new Sig(Sig.LD_INTFC, Sig.MM_INTFC));
    }

    Commander.prototype.updateUser = function(event){
        var self = this;
        if(event.value == Sig.LVL_VCTR){
            self.currentFocusLevel = LevelDefinition.getNextSceneInfo(self.currentFocusLevel.act, self.currentFocusLevel.scene);
        }
        else if(event.value == Sig.LVL_DEFT){
            // Nothing to do at the moment. TODO: Make a database and update it.
        }
    };

    Commander.prototype.nextLevel = function(){
        var self = this;
        self.viewController.handle(new Sig(Sig.LD_TPBAR, Sig.GM_TPBAR));    // Change the interface
        self.viewController.handle(new Sig(Sig.LD_SDBAR, Sig.EM_SDBAR));
        var data = {};
        data.act = this.currentFocusLevel.act;
        data.scene = this.currentFocusLevel.scene;
        data.playerInfo = {};
        data.imageManager = self.imageManager;
        self.gameController.handle(new Sig(Sig.CMND_ACT, Sig.INIT_GAM, data));
    };

    Commander.prototype.startGame = function(data){
        var self = this;
        //set up canvas/buttons
        var canvas = data.canvas;
        self.gameController = new GameController(self);
        self.gameController.canvas = canvas;
        self.gameController.init();
        self.buttonFocus = self.gameController;
        //set up viewTransform
        var viewTransform = new ViewTransform(0,0,canvas);
        this.viewController.canvasManager.viewTransform = viewTransform;
        self.gameController.viewTransform = viewTransform;
        self.gameController.eightGenerations = self.eightGenerations;
        var data = {};
        //this is temp for now. Starting level 1 scene 1. Will change this to selected level.
        data.act = this.currentFocusLevel.act;
        data.scene = this.currentFocusLevel.scene;
        data.playerInfo = {};
        data.imageManager = self.imageManager;
        self.gameController.handle(new Sig(Sig.CMND_ACT, Sig.INIT_GAM, data));
    };

    return Commander;
});
