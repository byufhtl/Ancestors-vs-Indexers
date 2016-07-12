/**
 * Created by calvinmcm on 7/5/16.
 */

define(['jquery','GameController','GEvent'],function($, GameController, GEvent){

    function Commander(viewController, imageManager, eightGenerations, gameController){
        this.viewController = viewController;
        this.viewController.commander = this;
        this.imageManager = imageManager;
        this.gameController = gameController;
        this.gameController.eightGenerations = eightGenerations;
        this.eightGenerations = eightGenerations;
        this.currentAct = 2;
        this.currentScene = 1;
    }

    Commander.prototype.start = function(){
        var self = this;
        this.viewController.handle(new GEvent(GEvent.LD_INTFC, GEvent.MM_INTFC, []));
    };

    Commander.prototype.handle = function(event){
        var self = this;
        switch(event.value)
        {
            case GEvent.STRT_BTN:
                self.startLevel();
                break;
        }
    };

    Commander.prototype.startLevel = function(){
        var self = this;
        var canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 600;
        canvas.id = 'canvas';
        $('#canvas-div').append(canvas);
        self.gameController.canvas = canvas;

        self.gameController.loadResources().then(function (response) {
                self.gameController.initializeGame(self.currentAct, self.currentScene, self.eightGenerations);
                //re-init this since we just put the canvas in. It grabs the canvas in its init method
                self.viewController.eventManager.canvasManager.init();
                self.gameController.loop();
            },
            function (e) {
                console.log("Game was not able to load resources...");
            }
        );
    };

    return Commander;

});
