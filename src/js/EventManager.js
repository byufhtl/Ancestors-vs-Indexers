/**
 * Created by calvinmcm on 6/28/16.
 */

define(['GEvent','ButtonManager', 'CanvasManager', 'Point', 'model/IIndexer', 'indexers/Hobbyist', 'model/IBuilding', 'buildings/Library'],
function(GEvent, ButtonManager, CanvasManager, Point, standardIndexer, Hobbyist, standardBuilding, Library){


    function EventManager(ViewController, controller){
        this.controller = controller;
        this.viewController = ViewController;
        this.buttonManager = null;
        this.canvasManager = null;
        this.clickContext = null;
    }

    EventManager.prototype.init = function(){
        var self = this;
        self.buttonManager = new ButtonManager(self);
        self.canvasManager = new CanvasManager(self, this.controller.viewTransform);
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

    EventManager.prototype.getClosestNode = function(clickLocation)
    {
        var nodeStructure = this.controller.nodeStructure;
        var bestI;
        var bestJ;
        var shortestDistance = 100000;
        for (var i = 0; i < nodeStructure.length; i++)
        {
            for (var j = 0; j < nodeStructure[i].length; j++)
            {
              //replace pagx and pageY with actual click locations later on
                var distance = Math.sqrt((nodeStructure[i][j].xCoord - clickLocation.X) * (nodeStructure[i][j].xCoord - clickLocation.X)
                + (nodeStructure[i][j].yCoord - clickLocation.Y) * (nodeStructure[i][j].yCoord - clickLocation.Y));
                if (distance < 25)
                {
                    if (distance < shortestDistance)
                    {
                        if(!nodeStructure[i][j].occupied)
                        {
                            shortestDistance = distance;
                            bestI = i;
                            bestJ = j;
                        }
                    }
                }
            }
        }
        if (shortestDistance == 100000) return null;
        else
        {
            return nodeStructure[bestI][bestJ];
        }
    }

    EventManager.prototype.recordClicked = function(clickLocation)
    {
        var activeRecords = this.controller.activeRecords;
        for (var i = 0; i < activeRecords.length; i++)
        {
            if (activeRecords[i].includesPoint(clickLocation))
            {
                activeRecords.splice(i,1);
                this.controller.resourcePoints += 10;
                $('#points').text(this.controller.resourcePoints);
                --i;
                return true;
            }
        }
        return false;
    }

    EventManager.prototype.getNewIndexer = function()
    {
        switch (this.clickContext){
            case "standardIndexer":
                return new standardIndexer();
                break;
            case "hobbyist":
                return new Hobbyist();
                break;
        }
    }

    EventManager.prototype.getNewBuilding = function()
    {
        switch (this.clickContext){
          case "standardBuilding":
            return new standardBuilding();
            break;
          case "library":
            return new Library();
            break;
        }
    }

    EventManager.prototype.addIndexerOrBuilding = function(nearestNodeToClick)
    {
        if (this.clickContext.elementType == "building")
        {
            var tempBuilding = this.getNewBuilding;
            tempBuilding.xCoord = nearestNodeToClick.xCoord;
            tempBuilding.yCoord=  nearestNodeToClick.yCoord;
            this.controller.activeBuildings.push(tempBuilding);
        }
        else if (this.clickContext.elementType == "indexer")
        {
            var tempIndexer = this.getNewIndexer;
            tempIndexer.xCoord = nearestNodeToClick.xCoord;
            tempIndexer.yCoord = nearestNodeToClick.yCoord;
            this.controller.activeIndexers.push(tempIndexer);
        }
        nearestNodeToClick.occupied = true;
        this.controller.resourcePoints -= this.clickContext.cost;
        $('#points').text(this.controller.resourcePoints);
    }

    EventManager.prototype.handleCanvasClick = function(event){
        // last selected:  this.clickContext (object)
        // coordinates (raw) : event.data[0] (.pageX, .pageY, etc...)
        var realPointClicked = event.data[0];
        //check if we clicked on a record. If not, check if we clicked a node
        if (!this.recordClicked(realPointClicked))
        {
            var nearestNodeToClick = this.getClosestNode(realPointClicked);
            if (nearestNodeToClick != null && this.clickContext && this.clickContext.cost < this.controller.resourcePoints)
            {
                addIndexerOrBuilding(nearestNodeToClick);
            }
        }
    };

    return EventManager;
})
