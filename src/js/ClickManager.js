/**
 * Created by calvinmcm on 6/22/16.
 */

define(['jquery', 'model/IIndexer', 'indexers/Hobbyist', 'model/IBuilding', 'buildings/Library'],function($, standardIndexer, Hobbyist, standardBuilding, Library){

    /**
     *
     * @param controller the array of active records for the game. (reference)
     * @constructor Builds a click manager to handle on-canvas clicks.
     */
    function ClickManager(controller){
        this.controller = controller;
        this.elementToPlace = {};
        this.elementType;
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

    ClickManager.prototype.getNewBuilding = function(type){

      switch (type){
        case "standardBuilding":
          return new standardBuilding();
          break;
        case "library":
          return new Library();
          break;
      }
    };

    ClickManager.prototype.start = function(){
        var self = this;

        var draggable = false;
        var dragged = false;
        var sx = 0;
        var sy = 0;
        var dx = 0;
        var dy = 0;
        var tx = 0;
        var ty = 0;
        var lx = 0;
        var ly = 0;

        var topbarContainer = $('#topbar');
        topbarContainer.empty();
        topbarContainer.load("src/html/topbar.html", function(response){
          var sidebarContainer = $('#sidebar');
          sidebarContainer.empty();

            $('#structures-button').click(function(){
                var sidebarContainer = $('#sidebar');
                sidebarContainer.empty();
                sidebarContainer.load("src/html/buildings.html", function(response){
                    console.log((response) ? ("Buildings sidebar loaded,") : ("Buildings sidebar did not load."));

                    $('#button-1').click(function(){
                        self.elementToPlace.type = "standardBuilding";
                        self.elementToPlace.cost = 20;
                        self.elementType = "building";
                        console.log("changed element type to building");
                    });
                    $('#button-2').click(function(){
                        self.elementToPlace.type = "library";
                        self.elementToPlace.cost = 30;
                        self.elementType = "building";
                    });
                    $('#button-1-img').click(function(){$('#button-1').click()});
                    $('#button-2-img').click(function(){$('#button-2').click()});
              });
            });

            $('#indexers-button').click(function(){
                var sidebarContainer = $('#sidebar');
                sidebarContainer.empty();
                sidebarContainer.load("src/html/indexers.html", function(response){
                    console.log((response) ? ("Indexers sidebar loaded.") : ("Indexers sidebar did not load."));
                    $('#button-1').click(function(){
                      console.log("changed element type to indexer");
                        self.elementToPlace.type = "standardIndexer";
                        self.elementToPlace.cost = 20;
                        self.elementType = "indexer";
                    });
                    $('#button-2').click(function(){
                        self.elementToPlace.type = "hobbyistIndexer";
                        self.elementToPlace.cost = 30;
                        self.elementType = "indexer";
                    });
                    $('#button-1-img').click(function(){$('#button-1').click()});
                    $('#button-2-img').click(function(){$('#button-2').click()});
                });
            });

        });

        var canvas = $('#canvas');

        canvas.mousedown(function(event){
            draggable = true;
            console.log(event);

            sx = tx;
            sy = ty;
            lx = event.pageX;
            ly = event.pageY;
        });

        canvas.mousemove(function(event){

            if(draggable){
                dx = event.pageX - lx;
                dy = event.pageY - ly;
                tx += dx;
                ty += dy;
                lx = event.pageX; // Keep track of the new starting points.
                ly = event.pageY; // Track the new Y value.

                // Put a bit of an overlap between minor drags and clicks.
                if(!dragged){
                    var xx = tx - sx;
                    var yy = ty - sy;

                    console.log(dx, dy, xx, yy, tx, ty, lx, ly);
                    if(!((xx < 3 && x > -3) && (yy < 3 && yy > -3))){
                        dragged = true;
                    }
                }
            }
        });

        canvas.mouseup(function(clickEvent){

            draggable = false;
            if(!dragged){
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
                    self.checkPlaceIndexerOrBuilding(self, clickPt);
                }
            }
            dragged = false;
        });

        canvas.click(function(clickEvent){


        });
    };

    ClickManager.prototype.checkPlaceIndexerOrBuilding = function(self, clickPt)
    {
      if (self.elementToPlace != null)
      {
        if (self.controller.resourcePoints >= self.elementToPlace.cost)
        {
          var coordinates = self.getGridPoint(clickPt);
          console.log(coordinates);
          console.log("value at coordinates: " + self.controller.gameBoardGrid[coordinates.xPos][coordinates.yPos]);
          if (coordinates != null && !self.controller.gameBoardGrid[coordinates.xPos][coordinates.yPos])
          {
            console.log("placing indexer");
            self.controller.gameBoardGrid[coordinates.xPos][coordinates.yPos] = 1;
            if (self.elementType == "indexer")
            {
              var tempIndexer = self.getNewIndexer(self.elementToPlace.type);
              tempIndexer.xCoord = coordinates.xPos * 100 + 100;
              tempIndexer.yCoord = coordinates.yPos * 100 + 100;
              tempIndexer.lane = coordinates.yPos;
              self.controller.activeIndexers.push(tempIndexer);
            }
            else if (self.elementType == "building")
            {
              console.log("making a building");
              var tempBuilding = self.getNewBuilding(self.elementToPlace.type);
              tempBuilding.xCoord = coordinates.xPos * 100 + 100;
              tempBuilding.yCoord = coordinates.yPos * 100 + 100;
              self.controller.activeBuildings.push(tempBuilding);
            }
            self.controller.resourcePoints -= self.elementToPlace.cost;
            $('#points').text(self.controller.resourcePoints);
          }
        }
      }
    };


    ClickManager.prototype.stop = function(){
        $('#structures-button').off('click');
        $('#canvas').off('click');
    };

    return ClickManager;
});
