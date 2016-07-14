/**
 * Created by calvinmcm on 6/28/16.
 */

define(['EventManager','PanelManager','GEvent'],function(EventManager, PanelManager, GEvent){

    /**
     *
     * @param Controller
     * @constructor
     */
    function ViewController(gameController, Commander){
        //DON"T FORGET TO INITIALIZE THIS!!!!!!!!!!!!!!!!!!!!!!!!
        this.controller = gameController;
        console.log("game controller in view controller: " ,this.controller);
        this.viewController = null;
        this.panelManager = null;
    }

    ViewController.prototype.init = function(){
        var self = this;
        self.viewController = new EventManager(self, self.controller);
        self.viewController.init();
        self.panelManager = new PanelManager(self);
        self.panelManager.init();
    };

    ViewController.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case GEvent.LD_INTFC: // Load up an interface
                self.panelManager.handle(event);
                break;
            case GEvent.LD_TPBAR: // Load something into the top bar
                self.panelManager.handle(event);
                break;
            case GEvent.LD_SDBAR: // Load something into the side bar
                self.panelManager.handle(event);
                break;
            case GEvent.INTFC_LD: // Interface has been loaded
                self.processLoad(event);
                self.viewController.handle(event);
                break;
            case GEvent.TPBAR_LD: // Top bar has been loaded
                self.processLoad(event);
                self.viewController.handle(event);
                break;
            case GEvent.SDBAR_LD: // Side bar has been loaded
                self.processLoad(event);
                self.viewController.handle(event);
                break;
            case GEvent.CMND_ACT:
                console.log("got a command event");
                self.commander.handle(event);
                break;
            case GEvent.LD_MODAL:
                self.viewController.handle(event);
                break;
        }
    };

    ViewController.prototype.processLoad = function(event){
        if(event.data.indexOf("Failure") != -1){ // Failure handler
            console.log("A resource failed to load:", event.type, event.value);
        }
    };


    return ViewController;
});
