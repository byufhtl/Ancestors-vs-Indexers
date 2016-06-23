/**
 * Created by calvinmcm on 6/22/16.
 */

define(['jquery', 'model/IIndexer', 'indexers/Hobbyist'],function($, standardIndexer, Hobbyist){

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
        if (xPos < 0 || yPos < 0)
        {
          return;
        }
        var coordinates = {yPos: yPos, xPos: xPos};

        return coordinates;
    };

    ClickManager.prototype.getNewIndexer = function(type){

        switch (type){
            case "standardIndexer":
                return new standardIndexer();
                break;
            case "hobbyistIndexer":
                return new Hobbyist();
                break;
        }
    };

    ClickManager.prototype.start = function(){
        var self = this;

        $('#structures-button').click(function(){
            var sidebarContainer = $('#sidebar');
            sidebarContainer.empty();
            sidebarContainer.load("src/html/buildings.html", function(response){
                console.log((response) ? ("Buildings sidebar loaded,") : ("Buildings sidebar did not load."));
            });
        });

        $('#indexers-button').click(function(){
            var sidebarContainer = $('#sidebar');
            sidebarContainer.empty();
            sidebarContainer.load("src/html/indexers.html", function(response){
                console.log((response) ? ("Indexers sidebar loaded.") : ("Indexers sidebar did not load."));
                $('#button-1').click(function(){
                  self.elementToPlace.type = "standardIndexer";
                  self.elementToPlace.cost = 20;
                });
                $('#button-2').click(function(){
                    self.elementToPlace.type = "hobbyistIndexer";
                    self.elementToPlace.cost = 30;
                });
                $('#button-1-img').click(function(){$('#button-1').click()});
                $('#button-2-img').click(function(){$('#button-2').click()});
            });
        });

        $('#canvas').click(function(clickEvent){
            var clickPt = {xCoord:clickEvent.pageX - 200, yCoord:clickEvent.pageY - 135};
            var records = self.controller.activeRecords;
            var clickedRecord = false;
            for(var i = 0; i < records.length; ++i){
                if(records[i].includesPoint(clickPt)){
                    records.splice(i,1);
                    self.controller.resourcePoints += 10;
                    $('#points').text(self.controller.resourcePoints);
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
                  if (coordinates != null && !self.controller.gameBoardGrid[coordinates.xPos][coordinates.yPos])
                  {
                    self.controller.gameBoardGrid[coordinates.xPos][coordinates.yPos] = true;
                    var tempIndexer = self.getNewIndexer(self.elementToPlace.type);
                    tempIndexer.xCoord = coordinates.xPos * 100 + 100;
                    tempIndexer.yCoord = coordinates.yPos * 100 + 100;
                    tempIndexer.lane = coordinates.yPos;
                    self.controller.activeIndexers.push(tempIndexer);
                    self.controller.resourcePoints -= self.elementToPlace.cost;
                    $('#points').text(self.controller.resourcePoints);
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
