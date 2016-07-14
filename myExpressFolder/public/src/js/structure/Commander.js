/**
 * Created by calvin on 7/8/16.
 */

define([],function(){

    function Commander(imageManager, viewController){
        this.imageManager = imageManager;
        this.viewController = viewController;
        this.eightGenerations = null;
        this.gameController = null;
        this.levelsController = null;
        this.upgradesController = null;
        this.levelDefinition = null;
    }

    Commander.prototype.start = function(eightGens){
        var self = this;
        self.eightGenerations = eightGens;

        self.viewController.handle(new Sig(Sig.LD_INTFC, Sig.MM_INTFC, null)); // Load the Main Menu Interface.
    };

    Commander.prototype.handle = function(event){
        var self = this;
        switch(event.type){

        }
    };

    return Commander;
});