/**
 * Created by calvin on 7/8/16.
 */

define(['util/Sig', 'game/GameController','LevelDefinition'],function(Sig, GameController, LevelDefinition){


    function Commander(imageManager, viewController, king){
        this.king = king;
        this.imageManager = imageManager;
        this.viewController = viewController;
        this.eightGenerations = null;
        this.gameController = null;
        this.levelsController = null;
        this.upgradesController = null;
        this.userInformation = null;
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
        }
    };

    Commander.prototype.updateUser = function(event){
        var self = this;
        if(event.value == Sig.LVL_VCTR){
            var levelToLoad = LevelDefinition.getNextSceneInfo(this.controller.currentAct, this.controller.currentScene);
            this.gameController.handle(new Sig(Sig.CMND_ACT, Sig.INIT_GAM, levelToLoad));
            this.gameController.loop();
        }
        else if(event.value == Sig.LVL_DEFT){

        }
    };

    Commander.prototype.startGame = function(data){
        console.log("called start game");
        var self = this;
        var canvas = data.canvas;
        self.gameController = new GameController();
        self.gameController.canvas = canvas;
        self.gameController.eightGenerations = self.eightGenerations;
        var data = {};
        //this is temp for now
        data.act = 1;
        data.scene = 1;
        data.playerInfo = {};
        self.gameController.handle(new Sig(Sig.CMND_ACT, Sig.INIT_GAM, data));
    };

    return Commander;
});
