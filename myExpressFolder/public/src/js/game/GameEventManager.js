/**
 * Created by calvin on 7/26/16.
 */

define(["util/Sig", "util/Point", "LevelDefinition",  'model/IIndexer',  'indexers/Indexer_Animated', 'indexers/Hobbyist', 'indexers/Uber', 'indexers/Specialist', 'model/IBuilding', 'buildings/Library', 'drops/StoryTeller'],
function(Sig, Point, LevelDefinition, IIndexer, Indexer_Animated, Hobbyist, Uber, Specialist, IBuilding, Library, StoryTeller){

    function GameEventManager(controller){
        this.controller = controller;
    }

    GameEventManager.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case Sig.CMND_ACT:          self.controller.handle(event);                                          break;
            case Sig.ST_CLICK:          self.setClickContext(event);                                            break;
            case Sig.BTN_ACTN:
                switch (event.value) {
                    case Sig.NEXT_BTN:  self.nextLevelButtonClicked();                                          break;
                    case Sig.AGAN_BTN:  self.playAgainButtonClicked();                                          break;
                    case Sig.MENU_BTN:  self.mainMenuButtonClicked();                                           break;
                    case Sig.STRT_BTN:  self.startButtonClicked();                                              break;
                }
                break;
            case Sig.LD_MODAL:
                switch (event.value){
                    case Sig.ANC_INFO:  self.showAncestorInfo(event);                                           break;
                }
                break;
            case Sig.CNVS_CLK:          self.handleCanvasClick(event);                                          break;
        }
    };


    GameEventManager.prototype.showAncestorInfo = function(data)
    {
        var self = this;
        var indexToShow = data.data.tempData;
        console.log("indexToShow", indexToShow);
        var info = this.controller.defeatedAncestorInfo;
        $('#ancestorName').html(info[indexToShow].data.display.name);
        $('#ancestorInfoText').html(       "birthDate: " + (info[indexToShow].data.display.birthDate || "uknown") + "<br>"
                                         + "birthPlace: " + (info[indexToShow].data.display.birthPlace || "unknown") + "<br>"
                                         + "gender: " + (info[indexToShow].data.display.gender || "unknown") + "<br>"
                                         + "lifespan " + (info[indexToShow].data.display.lifespan || "unknown") + "<br>");
        $('#missingInfo').html("");

        var modal = $('#myModal');
        modal.modal('show');
        $('#myModal').modal({
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
        })
        $('#xButton').click(function(event) {
            modal.modal('hide');
            if (info[indexToShow + 1] != null)
            {
              console.log("calling again");
              var showAncestorInfoEvent = new Sig(Sig.LD_MODAL, Sig.ANC_INFO, {tempData: indexToShow + 1});
              self.handle(showAncestorInfoEvent);
            }
        });

    };

    GameEventManager.prototype.getClosestNode = function(clickLocation)
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

    GameEventManager.prototype.recordClicked = function(clickLocation) {
        var activeRecords = this.controller.active.records();
        for (var i = 0; i < activeRecords.length; i++)
        {
            var worldPt = this.controller.viewTransform.VtoW(clickLocation);
            var truePt = new Point(worldPt.X - 200, worldPt.Y -135);
            if (activeRecords[i].includesPoint(truePt))
            {
                activeRecords.splice(i,1);
                this.controller.active.resourcePoints += 10;
                $('#points').text(this.controller.active.resourcePoints);
                --i;
                return true;
            }
        }
        return false;
    };

    GameEventManager.prototype.getNewIndexer = function() {
        switch (this.clickContext.class){
            case "standardIndexer":
                console.log("Indexer:", Indexer_Animated);
                console.log("Specialist:", Specialist);
                return new Indexer_Animated();
                break;
            case "hobbyist":
                return new Hobbyist();
                break;
            case "uber":
                return new Uber();
                break;

            case "researcher":
                console.log("making a researcher");
                return new Specialist();
                break;
        }
    };

    GameEventManager.prototype.getNewBuilding = function() {
        switch (this.clickContext.class){
          case "standardBuilding":
            return new IBuilding();
            break;
          case "library":
            return new Library();
            break;
        }
    };

    GameEventManager.prototype.getNewDrop = function()
    {
        switch(this.clickContext.class){
          case "StoryTeller":
            return new StoryTeller();
            break;
        }
    };


    GameEventManager.prototype.addDrop = function(pointClicked) {
        if (this.clickContext.elementType == "StoryTeller"){
            var activeStoryTellers = self.controller.active.storyTellers();
            var tempStoryTeller = new StoryTeller();
            tempStoryTeller.xCoord =pointClicked.X;
            tempStoryTeller.yCoord =pointClicked.Y;
            activeStoryTellers.push(tempStoryTeller);
        }
    };

    GameEventManager.prototype.addIndexerOrBuilding = function(nearestNodeToClick) {
        var self = this;
        var nodeStructure = this.controller.nodeStructure;
        if (this.clickContext.elementType == "building")
        {
              var activeBuildings = self.controller.active.buildings();

              var tempBuilding = this.getNewBuilding();
              tempBuilding.xCoord = nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].xCoord;
              tempBuilding.yCoord =  nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].yCoord;
              self.controller.active.buildings().push(tempBuilding);
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
            this.controller.active.indexers().push(tempIndexer);
        }

        nodeStructure[nearestNodeToClick.X][nearestNodeToClick.Y].occupied = true;
        this.controller.active.resourcePoints -= this.clickContext.cost;
        $('#points').text(this.controller.active.resourcePoints);
    };

    GameEventManager.prototype.handleCanvasClick = function(event) {
        // last selected:  this.clickContext (object)
        // coordinates (raw) : event.data[0] (.pageX, .pageY, etc...)
        var realPointClicked = event.data.point;

        //check if we clicked on a record. If not, check if we clicked a node
        if (!this.recordClicked(realPointClicked))
        {
            if (this.clickContext.elementType == "drop"){
                this.addDrop(realPointClicked);
            }
            else{
                var nearestNodeToClick = this.getClosestNode(realPointClicked);
                if (nearestNodeToClick != null && this.clickContext && this.clickContext.cost <= this.controller.active.resourcePoints)
                {
                    this.addIndexerOrBuilding(nearestNodeToClick);
                }
            }
        }
    };

    /**
     * Changes the context that controls what happens when the user clicks on the main board.
     * @param event - See [Sig.js]
     */
    GameEventManager.prototype.setClickContext = function(event) {
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
            case Sig.RSCH_IDX:
                self.clickContext = {elementType:"indexer", class:"researcher", cost:30};
                break;
            case Sig.STRY_DRP:
                self.clickContext = {elementType:"drop", class:"StoryTeller", cost:30};
                break;
        }
    };

    /**
     * Handler for when the start button is clicked
     */
    GameEventManager.prototype.startButtonClicked = function() {
        this.controller.handle(new Sig(Sig.CMND_ACT, Sig.STRT_BTN));
    };

    /**
     * The next level button click handler
     */
    GameEventManager.prototype.nextLevelButtonClicked = function() {
        this.controller.handle(new Sig(Sig.UPD_USER, Sig.LVL_VCTR));    // Save
        this.controller.handle(new Sig(Sig.LD_TPBAR, Sig.GM_TPBAR));    // Change the interface
        this.controller.handle(new Sig(Sig.LD_SDBAR, Sig.BLNK_PNL));
        this.controller.handle(new Sig(Sig.LVL_CMND, Sig.STRT_LVL));    // Continue
        // var levelToLoad = LevelDefinition.getNextSceneInfo(this.controller.currentAct, this.controller.currentScene);
        // this.controller.initializeGame(levelToLoad.act, levelToLoad.scene, {});
        // this.controller.loop();
    };

    GameEventManager.prototype.playAgainButtonClicked = function() {
        this.controller.handle(new Sig(Sig.UPD_USER, Sig.LVL_DEFT));    // Save
        this.controller.handle(new Sig(Sig.LD_TPBAR, Sig.GM_TPBAR));    // Change the interface
        this.controller.handle(new Sig(Sig.LD_SDBAR, Sig.BLNK_PNL));
        this.controller.handle(new Sig(Sig.LVL_CMND, Sig.STRT_LVL));    // Continue
        // this.controller.initializeGame(this.controller.currentAct, this.controller.currentScene, {}); // replay level.
        // this.controller.loop();
    };

    GameEventManager.prototype.mainMenuButtonClicked = function() {
        location.reload();
    };

    return GameEventManager;
});
