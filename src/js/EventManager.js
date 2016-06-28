/**
 * Created by calvinmcm on 6/28/16.
 */

define(['GEvent','ButtonManager', 'CanvasManager'],function(GEvent, ButtonManager, CanvasManager){

    function EventManager(ViewController){
        this.viewController = ViewController;
        this.buttonManager = null;
        this.canvasManager = null;
        this.clickContext = null;
    }

    EventManager.prototype.init = function(){
        var self = this;
        self.buttonManager = new ButtonManager(self);
        self.canvasManager = new CanvasManager(self);
        self.canvasManager.init();
    };

    /**
     * The handler for events being passed from the button elements. Separated for convenience.
     * @param event - See [GEvent.js]
     */
    EventManager.prototype.handleButtonEvent = function(event){
        var self = this;
        switch(event.type){
            case GEvent.LD_SDBAR:
                self.viewController.handle(event);
                break;

            case GEvent.ST_CLICK:
                self.setClickContext(event);
                break;

        }
    };

    /**
     * The handler for events being passed from the canvas element. Separated for convenience.
     * @param event - See [GEvent.js]
     */
    EventManager.prototype.handleCanvasEvent = function(event){
        var self = this;
        switch(event.type){
            case GEvent.CNVS_CLK:
                self.handleCanvasClick(event);
                break;
        }
    };

    /**
     * The primary handler for events coming from higher upstream.
     * @param event - See [GEvent.js]
     */
    EventManager.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case GEvent.TPBAR_LD:
                self.buttonManager.handle(event);
                break;
            case GEvent.SDBAR_LD:
                self.buttonManager.handle(event);
                break;
        }
    };

    /**
     * Changes the context that controls what happens when the user clicks on the main board.
     * @param event - See [GEvent.js]
     */
    EventManager.prototype.setClickContext = function(event){
        var self = this;
        switch(event.value){
            case GEvent.STAN_BLD:
                self.clickContext = {elementType:"building", class:"standardBuilding", cost:20};
                break;
            case GEvent.LIBR_BLD:
                self.clickContext = {elementType:"building", class:"library", cost:30};
                break;
            case GEvent.STAN_IDX:
                self.clickContext = {elementType:"indexer", class:"standardIndexer", cost:20};
                break;
            case GEvent.HOBB_IDX:
                self.clickContext = {elementType:"indexer", class:"hobbyist", cost:30};
                break;
        }
    };

    EventManager.prototype.handleCanvasClick = function(event){
        // last selected:  this.clickContext (object)
        // coordinates (raw) : event.data[0] (.pageX, .pageY, etc...)
    };

    return EventManager;
});