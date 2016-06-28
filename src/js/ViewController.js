/**
 * Created by calvinmcm on 6/28/16.
 */

define(['EventManager','PanelManager','GEvent'],function(EventManager, PanelManager, GEvent){

    /**
     *
     * @param Controller
     * @constructor
     */
    function ViewController(Controller){
        this.controller = Controller;
        this.eventManager = null;
        this.panelManager = null;
    }

    ViewController.prototype.init = function(){
        var self = this;
        self.eventManager = new EventManager(self, self.controller);
        self.eventManager.init();
        self.panelManager = new PanelManager(self);
        self.panelManager.init();
    };

    ViewController.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case GEvent.LD_TPBAR: // Load something into the top bar
                self.panelManager.handle(event);
                break;
            case GEvent.LD_SDBAR: // Load something into the side bar
                self.panelManager.handle(event);
                break;
            case GEvent.TPBAR_LD: // Top bar has been loaded
                self.eventManager.handle(event);
                break;
            case GEvent.SDBAR_LD: // Side bar has been loaded
                self.eventManager.handle(event);
                break;
        }

    };

    return ViewController;
});