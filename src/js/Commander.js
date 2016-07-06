/**
 * Created by calvinmcm on 7/5/16.
 */

define(['jquery','GameController','GEvent'],function($, GameController, GEvent){

    function Commander(viewController, imageManager, eightGenerations){
        this.viewController = viewController;
        this.imageManager = imageManager;
        this.gameController;
        this.eightGenerations = eightGenerations;
        this.currentAct = 1;
        this.currentScene = 1;
    }

    Commander.prototype.start = function(){
        var self = this;
        this.viewController.handle(new GEvent(GEvent.LD_INTFC, GEvent.MM_INTFC, []));
        self.gameController = new GameController();
    };

    Commander.prototype.handle = function(event){

    };

    Commander.prototype.startLevel = function(){
        var self = this;
        self.gameController.initializeGame(self.currentAct, self.currentScene, self.eightGenerations);
    };

    return Commander;

});