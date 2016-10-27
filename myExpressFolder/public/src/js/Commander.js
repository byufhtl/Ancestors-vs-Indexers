/**
 * Created by calvin on 7/8/16.
 * The Commander is in charge of managing the relationships between the controllers and the client-server services
 * such as Audio, HTML, and Image managers, the FS Manager, and the ServerManager.
 * It also handles the substitution of the viewManager and Model injection.
 */

///<reference path="../util/Signal.ts"

define(['FamilySearchHandler','game/ViewTransform', 'ServerFacade', 'audio/AudioManager'],
    function(FamilySearchHandler, ViewTransform, ServerFacade, AudioManager){


    function Commander(){

        this.FSManager = null;
        this.serverManager = null;
        this.imageManager = null;
        this.audioManager = null;


        this.model = null;
        this.currController = null;
        this.viewController = null;
    }

    Commander.prototype.start = function(eightGens, userInformation){
        var self = this;

        self.FSManager = new FamilySearchHandler();

        // Open up the audio
        self.audioManager = new AudioManager();
        self.audioManager.init();
        self.audioManager.play();
        var doThis = function(resolution){
            if(resolution) {
                self.userData = resolution;
                // self.currentFocusLevel.act = self.userData.data.furthestAct;
                // self.currentFocusLevel.scene = self.userData.data.furthestScene;
            }
            else{
                if(userInformation.data.__next_id == "cis.user.MMMM-6M3N") {
                    console.log("<<CLIENT>> Forwarding around server");
                    self.userData = {data:{furthestAct: 1, furthestAct: 1}};
                    self.currentFocusLevel.act = self.currentFocusLevel.scene = 1;
                }
            }
            console.log("<<COMMANDER - SETUP>> currentFocusLevel: ", self.currentFocusLevel);
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
        ServerFacade.retrieveUserData(userInformation.data.__next_id).then(doThis,doThis);
        //ServerFacade.postUserData(null);
        //ServerFacade.retrieveUserData('bilbo');
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
                else if (event.value == Sig.AGAN_BTN) self.nextLevel();
                else if (event.value == Sig.MENU_BTN) self.returnMainMenu();
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
            case Sig.KEY_ACTN:
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
    };

    Commander.prototype.updateUser = function(event){
        var self = this;
        if(event.value == Sig.LVL_VCTR){
            self.currentFocusLevel = LevelDefinition.getNextSceneInfo(self.currentFocusLevel.act, self.currentFocusLevel.scene);
            if (self.currentFocusLevel.act > self.userData.data.furthestAct){
                self.userData.data.furthestAct = self.currentFocusLevel.act;
                self.userData.data.furthestScene = 1;
            }
            else if (self.currentFocusLevel.act == self.userData.data.furthestAct && self.currentFocusLevel.scene > self.userData.data.furthestScene){
                self.userData.data.furthestScene = self.currentFocusLevel.scene;
            }
            self.userData.data.lastUpdate = Date.now();
            ServerFacade.postUserData(this.userData);
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
