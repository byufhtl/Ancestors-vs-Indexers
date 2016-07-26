/**
 * Created by calvin on 7/8/16.
 */

define(['util/Sig','LevelDefinition'],function(Sig, LevelDefinition){

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
        console.log("at least we called start on the commander");
        // Load up all of the images
        self.imageManager.handle(new Sig(Sig.LD_IMGST, Sig.ALL_IMGS)).then(
            function(failedArray){
                if(failedArray.length){
                  console.log("we have failed", failedArray);
                    var report = "The Following Image Load Batches Failed to Load: " + failedArray.toString();
                    self.king.handle(new Sig(Sig.SFAILURE), Sig.CRT_FAIL, {report: report});
                }
                else {
                  console.log("attempting to load the main menu");
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

    return Commander;
});
