/**
 * Created by calvinmcm on 6/28/16.
 */

define(['jquery','GEvent','ButtonManager', 'CanvasManager', 'Point', 'model/IIndexer', 'indexers/Hobbyist', 'indexers/Uber', 'model/IBuilding', 'buildings/Library', 'LevelDefinition'],
function($,GEvent, ButtonManager, CanvasManager, Point, standardIndexer, Hobbyist, Uber, standardBuilding, Library, LevelDefinition){


    function EventManager(ViewController, controller){
        this.controller = controller;
        this.viewController = ViewController;
        this.buttonManager = null;
        this.canvasManager = null;
        this.clickContext = null;;
    }

    EventManager.prototype.init = function(){
        var self = this;
        self.buttonManager = new ButtonManager(self);
        self.canvasManager = new CanvasManager(self, self.controller.viewTransform);
        self.canvasManager.init();
    };

    /**
     * The handler for events being passed from the button elements. Separated for convenience.
     * @param event - See [GEvent.js]
     */
    EventManager.prototype.handleButtonEvent = function(event){
        var self = this;
        switch(event.type){
            case GEvent.LD_INTFC:
                self.viewController.handle(event);
                break;

            case GEvent.LD_SDBAR:
                self.viewController.handle(event);
                break;

            case GEvent.ST_CLICK:
                self.setClickContext(event);
                break;

            case GEvent.BTN_ACTN:
                switch (event.value){
                    case GEvent.NEXT_BTN:
                        self.nextLevelButtonClicked();
                        break;
                    case GEvent.AGAN_BTN:
                        self.playAgainButtonClicked();
                        break;
                    case GEvent.MENU_BTN:
                        self.mainMenuButtonClicked();
                        break;
                    case GEvent.LOGN_BTN:
                        self.loginButtonClicked(event.data[0]);
                        break;
                }
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
    EventManager.prototype.handle = function(event)
    {
        var self = this;
        switch(event.type){
            case GEvent.TPBAR_LD:
                self.buttonManager.handle(event);
                break;
            case GEvent.SDBAR_LD:
                self.buttonManager.handle(event);
                break;
            case GEvent.INTFC_LD:
                self.buttonManager.handle(event);
                break;
        }
    };

    /**
     * Changes the context that controls what happens when the user clicks on the main board.
     * @param event - See [GEvent.js]
     */
    EventManager.prototype.setClickContext = function(event)
    {
        var self = this;
        switch(event.value){
            case GEvent.STAN_BLD:
                //console.log("set context to standardBuilding");
                self.clickContext = {elementType:"building", class:"standardBuilding", cost:20};
                break;
            case GEvent.LIBR_BLD:
                //console.log("set context to library");
                self.clickContext = {elementType:"building", class:"library", cost:30};
                break;
            case GEvent.STAN_IDX:
                //console.log("set context to standardIndexer");
                self.clickContext = {elementType:"indexer", class:"standardIndexer", cost:20};
                break;
            case GEvent.HOBB_IDX:
                //console.log("set context to hobbyist");
                self.clickContext = {elementType:"indexer", class:"hobbyist", cost:30};
                break;
            case GEvent.UBER_IDX:
                //console.log("set context to hobbyist");
                self.clickContext = {elementType:"indexer", class:"uber", cost:0};
                break;
        }
    };

    EventManager.prototype.loginButtonClicked = function(FamilySearchHandler)
    {
        FamilySearchHandler.login();
    };

    EventManager.prototype.nextLevelButtonClicked = function()
    {
        console.log("next level button clicked");
        this.viewController.handle(new GEvent(GEvent.LD_TPBAR, GEvent.GM_TPBAR));
        this.viewController.handle(new GEvent(GEvent.LD_SDBAR, GEvent.BLNK_PNL));
        console.log("before levelToLoad: " + this.controller.currentAct);
        var levelToLoad = LevelDefinition.getNextSceneInfo(this.controller.currentAct, this.controller.currentScene);
        console.log('after levelToLoad: ' + this.controller.currentAct);
        console.log('levelToLoad act: ' + levelToLoad.act);
        this.controller.initializeGame(levelToLoad.act, levelToLoad.scene, {});
        console.log('after initializeGame: ' + this.controller.currentAct);
        this.controller.loop();
    };

    EventManager.prototype.playAgainButtonClicked = function()
    {
        this.viewController.handle(new GEvent(GEvent.LD_TPBAR, GEvent.GM_TPBAR));
        this.viewController.handle(new GEvent(GEvent.LD_SDBAR, GEvent.BLNK_PNL));
        this.controller.initializeGame(this.controller.currentAct, this.controller.currentScene, {}); // replay level.
        this.controller.loop();
    };

    EventManager.prototype.mainMenuButtonClicked = function()
    {

        location.reload();
    };

    /**
     * Determines which node is closest to a given click location
     * @param clickLocation the world-to-view converted location of a click event.
     * @returns {*} A node, if one exists within a reasonable range. Otherwise returns false.
     */

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
                if (distance < 50)
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
            var nodeCoords = {'X':bestI, 'Y':bestJ};
            return nodeCoords;
        }
    };

    EventManager.prototype.recordClicked = function(clickLocation)
    {
        var activeRecords = this.controller.activeRecords;
        for (var i = 0; i < activeRecords.length; i++)
        {
            var worldPt = this.controller.viewTransform.VtoW(clickLocation);
            var truePt = new Point(worldPt.X - 200, worldPt.Y -135);
            if (activeRecords[i].includesPoint(truePt))
            {
                activeRecords.splice(i,1);
                this.controller.resourcePoints += 10;
                $('#points').text(this.controller.resourcePoints);
                --i;
                return true;
            }
        }
        return false;
    };

    EventManager.prototype.getNewIndexer = function()
    {
        switch (this.clickContext.class){
            case "standardIndexer":
                return new standardIndexer();
                break;
            case "hobbyist":
                return new Hobbyist();
                break;
            case "uber":
                return new Uber();
                break;
        }
    };

    EventManager.prototype.getNewBuilding = function()
    {
        switch (this.clickContext.class){
          case "standardBuilding":
            return new standardBuilding();
            break;
          case "library":
            return new Library();
            break;
        }
    };


    EventManager.prototype.addIndexerOrBuilding = function(nearestNodeToClick)
    {
        var self = this;
        var nodeStructure = this.controller.nodeStructure;
        if (this.clickContext.elementType == "building")
        {
              var activeBuildings = self.controller.activeBuildings;

              var tempBuilding = this.getNewBuilding();
              tempBuilding.xCoord = nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].xCoord;
              tempBuilding.yCoord =  nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].yCoord;
              self.controller.activeBuildings.push(tempBuilding);
        }
        else if (this.clickContext.elementType == "indexer")
        {
            var tempIndexer = this.getNewIndexer();
            tempIndexer.xCoord = nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].xCoord;
            tempIndexer.yCoord = nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].yCoord;
            tempIndexer.xNode = nearestNodeToClick.X;
            tempIndexer.yNode = nearestNodeToClick.Y;
            this.controller.activeIndexers.push(tempIndexer);
        }
        nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].occupied = true;
        this.controller.resourcePoints -= this.clickContext.cost;
        $('#points').text(this.controller.resourcePoints);
    };

    EventManager.prototype.handleCanvasClick = function(event)
    {
        // last selected:  this.clickContext (object)
        // coordinates (raw) : event.data[0] (.pageX, .pageY, etc...)
        var realPointClicked = event.data[0];
        //check if we clicked on a record. If not, check if we clicked a node
        if (!this.recordClicked(realPointClicked))
        {
            var nearestNodeToClick = this.getClosestNode(realPointClicked);
            if (nearestNodeToClick != null && this.clickContext && this.clickContext.cost <= this.controller.resourcePoints)
            {
                this.addIndexerOrBuilding(nearestNodeToClick);
            }
        }
    };

    return EventManager;
});
