/**
 * Created by calvinmcm on 7/5/16.
 */

define(['jquery','GameController','GEvent'],function($, GameController, GEvent){

    function Commander(viewController, imageManager){
        this.viewController = viewController;
        this.imageManager = imageManager;
        this.gameController;
    }

    Commander.prototype.start = function(){
        var self = this;
        this.viewController.handle(new GEvent(GEvent.LD_INTFC, GEvent.GM_INTFC, []));
        self.gameController = new GameController();
    };

    Commander.prototype.handle = function(event){

    };


    return Commander;

});