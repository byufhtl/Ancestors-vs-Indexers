/**
 * Created by calvinmcm on 6/22/16.
 */

define(['jquery', 'IIndexer'],function($, standardIndexer){

    /**
     *
     * @param controller the array of active records for the game. (reference)
     * @constructor Builds a click manager to handle on-canvas clicks.
     */
    function ClickManager(controller){
        this.controller = controller;
        this.elementToPlace = {};
    }

    ClickManager.prototype.getGridPoint = function(clickPt){
        var xPos = Math.floor((clickPt.xCoord - 100) / 100);
        var yPos = Math.floor((clickPt.yCoord - 100) / 100);
        console.log("xPos: " + xPos);
        console.log("yPos: " + yPos);
        if (xPos < 0 || yPos < 0)
        {
          return;
        }
        var coordinates = {row: xPos, column: yPos};
        return coordinates;
    };

    ClickManager.prototype.getNewIndexer = function(type){
        if (type == "standardIndexer")
        {
          return new standardIndexer();
        }
    };

    ClickManager.prototype.start = function(){
        var self = this;

        $('#structures-button').click(function(){
            var sidebarContainer = $('#sidebar');
            sidebarContainer.empty();
            sidebarContainer.load("src/html/buildings.html", function(response){
                console.log((response) ? ("Buildings sidebar loaded with response: " + response) : ("Buildings sidebar loaded with no response."));
            });
        });

        $('#indexers-button').click(function(){
            console.log("folks!!!!!");
            var sidebarContainer = $('#sidebar');
            sidebarContainer.empty();
            sidebarContainer.load("src/html/indexers.html", function(response){
                console.log((response) ? ("Buildings sidebar loaded with response: " + response) : ("Buildings sidebar loaded with no response."));
                $('#button-1').click(function(){
                  self.elementToPlace.type = "standardIndexer";
                  self.elementToPlace.cost = 20;
                });
            });
        });

        $('#canvas').click(function(clickEvent){
            var clickPt = {xCoord:clickEvent.pageX - 200, yCoord:clickEvent.pageY - 135};
            var records = self.controller.activeRecords;
            var clickedRecord = false;
            for(var i = 0; i < records.length; ++i){
                if(records[i].includesPoint(clickPt)){

                    console.log("You just clicked on the record at " + JSON.stringify(clickPt));
                    records.splice(i,1);
                    self.controller.resourcePoints += 10;
                    console.log("You just won 10 points! Now you have " + self.controller.resourcePoints + " points! Wow!");
                    --i;
                    clickedRecord = true;
                    break;
                }
            }
            if (!clickedRecord)
            {
              if (this.elementToPlace != false)
              {
                if (self.controller.resourcePoints >= self.elementToPlace.cost)
                {
                  var coordinates = self.getGridPoint(clickPt);
                  if (coordinates != null && !self.controller.gameBoardGrid[coordinates.row][coordinates.column])
                  {
                    console.log("making an indexer");
                    self.controller.gameBoardGrid[coordinates.row][coordinates.column] = true;
                    var tempIndexer = self.getNewIndexer(self.elementToPlace.type);
                    tempIndexer.xCoord = coordinates.row * 100 + 100;
                    tempIndexer.yCoord = coordinates.column * 100 + 100;
                    tempIndexer.lane = coordinates.row;
                    self.controller.activeIndexers.push(tempIndexer);
                    self.controller.resourcePoints -= self.elementToPlace.cost;
                  }
                }
              }
            }
        });
    };

    ClickManager.prototype.stop = function(){
        $('#structures-button').off('click');
        $('#canvas').off('click');
    };

    return ClickManager;
});
