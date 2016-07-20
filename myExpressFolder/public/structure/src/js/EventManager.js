/**
 * Created by calvinmcm on 6/28/16.
 */

define(['jquery','util/Sig', 'Point', 'model/IIndexer', 'indexers/Hobbyist', 'indexers/Uber',
    'indexers/Specialist', 'model/IBuilding', 'buildings/Library', 'LevelDefinition'],
function($,Sig, Point, standardIndexer, Hobbyist, Uber, Specialist, standardBuilding, Library, LevelDefinition){


    function EventManager(gameController){
        this.controller = gameController;
        this.clickContext = null;
    }

    EventManager.prototype.init = function(){
        var self = this;
    };

    /**
     * The handler for events being passed from the button elements. Separated for convenience.
     * @param event - See [Sig.js]
     */
    EventManager.prototype.handleButtonEvent = function(event){
        var self = this;
        switch(event.type){
            case Sig.CMND_ACT:
                self.controller.handle(event);
                break;
            case Sig.LD_INTFC:
                self.controller.handle(event);
                break;
            case Sig.LD_SDBAR:
                self.controller.handle(event);
                break;
            case Sig.ST_CLICK:
                self.setClickContext(event);
                break;
            case Sig.BTN_ACTN:
                switch (event.value){
                    case Sig.NEXT_BTN:
                        self.nextLevelButtonClicked();
                        break;
                    case Sig.AGAN_BTN:
                        self.playAgainButtonClicked();
                        break;
                    case Sig.MENU_BTN:
                        self.mainMenuButtonClicked();
                        break;
                    case Sig.LOGN_BTN:
                        self.loginButtonClicked(event.data[0]);
                        break;
                    case Sig.STRT_BTN:
                        self.startButtonClicked();
                        break;
                }
            break;

        }
    };


    /**
     * The primary handler for events coming from higher upstream.
     * @param event - See [Sig.js]
     */
    EventManager.prototype.handle = function(event)
    {
        var self = this;
        switch(event.type){
            case Sig.CMND_ACT:          self.controller.handle(event);                                          break;
            case Sig.ST_CLICK:          self.setClickContext(event);                                            break;
            case Sig.BTN_ACTN:
                switch (event.value) {
                    case Sig.NEXT_BTN:  self.nextLevelButtonClicked();                                          break;
                    case Sig.AGAN_BTN:  self.playAgainButtonClicked();                                          break;
                    case Sig.MENU_BTN:  self.mainMenuButtonClicked();                                           break;
                    case Sig.LOGN_BTN:  self.loginButtonClicked(event.data[0]);                                 break;
                    case Sig.STRT_BTN:  self.startButtonClicked();                                              break;
                }
                break;
            case Sig.LD_MODAL:
                switch (event.value){
                    case Sig.ANC_INFO:  self.controller.handle(event);                                          break;
                }
                break;
            case Sig.CNVS_CLK:          self.handleCanvasClick(event);                                          break;

        }
    };

    /**
     * Changes the context that controls what happens when the user clicks on the main board.
     * @param event - See [Sig.js]
     */
    EventManager.prototype.setClickContext = function(event)
    {
        var self = this;
        switch(event.value){
            case Sig.STAN_BLD:
                //console.log("set context to standardBuilding");
                self.clickContext = {elementType:"building", class:"standardBuilding", cost:20};
                break;
            case Sig.LIBR_BLD:
                //console.log("set context to library");
                self.clickContext = {elementType:"building", class:"library", cost:30};
                break;
            case Sig.STAN_IDX:
                //console.log("set context to standardIndexer");
                self.clickContext = {elementType:"indexer", class:"standardIndexer", cost:20};
                break;
            case Sig.HOBB_IDX:
                //console.log("set context to hobbyist");
                self.clickContext = {elementType:"indexer", class:"hobbyist", cost:30};
                break;
            case Sig.UBER_IDX:
                //console.log("set context to hobbyist");
                self.clickContext = {elementType:"indexer", class:"uber", cost:0};
                break;
            case Sig.SPCL_IDX:
                self.clickContext = {elementType:"indexer", class:"specialist", cost:30};
                break;
        }
    };


    EventManager.prototype.showAncestorInfo = function(data)
    {
        var self = this;
        var indexToShow = data[0];
        var info = this.controller.defeatedAncestorInfo;

        $('#ancestorName').html(info[0].data.display.name);
        $('#ancestorInfoText').html(       "birthDate: " + (info[indexToShow].data.display.birthDate || "uknown") + "<br>"
                                         + "birthPlace: " + (info[indexToShow].data.display.birthPlace || "unknown") + "<br>"
                                         + "gender: " + (info[indexToShow].data.display.gender || "unknown") + "<br>"
                                         + "lifespan " + (info[indexToShow].data.display.lifespan || "unknown") + "<br>");
        $('#missingInfo').html("");

        var modal = $('#myModal');
        modal.modal('show');

        // When the user clicks anywhere outside of the modal, close it
        /*
        $(window).click(function(event) {
            if (event.target != modal) {
                modal.modal('hide');
                if (info[indexToShow + 1] != null)
                {
                  var showAncestorInfoEvent = new Sig(Sig.LD_MODAL, Sig.ANC_INFO, [indexToShow + 1]);
                  self.lieutenant.handle(showAncestorInfoEvent);
                }

            }
        });
        */
        $('#xButton').click(function(event) {
            modal.modal('hide');
            if (info[indexToShow + 1] != null)
            {
              var showAncestorInfoEvent = new Sig(Sig.LD_MODAL, Sig.ANC_INFO, [indexToShow + 1]);
              self.controller.handle(showAncestorInfoEvent);
            }

        });
    };

    EventManager.prototype.startButtonClicked = function()
    {
        this.controller.handle(new Sig(Sig.CMND_ACT, Sig.STRT_BTN));
    };


    EventManager.prototype.loginButtonClicked = function(FamilySearchHandler)
    {
        FamilySearchHandler.login();
    };

    EventManager.prototype.nextLevelButtonClicked = function()
    {
        this.controller.handle(new Sig(Sig.LD_TPBAR, Sig.GM_TPBAR));
        this.controller.handle(new Sig(Sig.LD_SDBAR, Sig.BLNK_PNL));
        var levelToLoad = LevelDefinition.getNextSceneInfo(this.controller.currentAct, this.controller.currentScene);
        this.controller.initializeGame(levelToLoad.act, levelToLoad.scene, {});
        this.controller.loop();
    };

    EventManager.prototype.playAgainButtonClicked = function()
    {
        this.controller.handle(new Sig(Sig.LD_TPBAR, Sig.GM_TPBAR));
        this.controller.handle(new Sig(Sig.LD_SDBAR, Sig.BLNK_PNL));
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
            case "specialist":
                console.log("making a specialist");
                return new Specialist();
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
            if (tempIndexer.type == "specialist")
            {
                tempIndexer.homeXCoord = nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].xCoord;
                tempIndexer.homeYCoord = nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].yCoord;
            }
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
