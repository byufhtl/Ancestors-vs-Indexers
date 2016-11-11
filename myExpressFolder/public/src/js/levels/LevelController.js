/**
 * Created by calvin on 7/29/16.
 */

define(['util/Sig'],function(Sig){

    /**
     * Level Controller
     * The main handler for the levels interface. Players will be able to select what level they want to play next, view
     * their high scores, and see the status of their achievements.
     * 
     * Includes embedded functionality of an EventManager - handling the clicking and button pressing events
     * 
     * @type {Function} The LevelController class (instantiable)
     */    
    var LevelController = (function(){ // Wrapping it likes this keeps the prototype together a little better, I think.
        
        function LevelController(){
                 
        }
        
        LevelController.prototype.handle = function(event){
            var self = this;
            switch(event.type){
                case Sig.CMND_ACT:
                    self.obeyCommand(event.value, event.data);
                    break;
            }
        };

        LevelController.prototype.obeyCommand = function(value, data){
            var self = this;
            switch(value){
                case Sig.DISBL_UI:
                    self.paused = true;
                    break;
                case Sig.ENABL_UI:
                    self.paused = false;
                    self.__lastTime = Date.now();
                    break;
                case Sig.INIT_GAM:
                    self.initializeLevels(data.playerInfo, data.imageManager);
                    break;
            }
        };

        LevelController.prototype.initializeLevels = function(playerInfo, imageManager){

        };
        
        return LevelController;
    });
    
    return LevelController;
});