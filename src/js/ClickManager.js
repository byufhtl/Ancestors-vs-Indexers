/**
 * Created by calvinmcm on 6/22/16.
 */

define(['jquery'],function($){

    /**
     *
     * @param controller the array of active records for the game. (reference)
     * @constructor Builds a click manager to handle on-canvas clicks.
     */
    function ClickManager(controller){
        this.controller = controller;

    }

    ClickManager.prototype.start = function(){
        var self = this;

        $('#structures-button').click(function(){
            var sidebarContainer = $('#sidebar');
            sidebarContainer.empty();
            sidebarContainer.load("src/html/buildings.html", function(response){
                console.log((response) ? ("Buildings sidebar loaded with response: " + response) : ("Buildings sidebar loaded with no response."));
            });
        });

        $('#canvas').click(function(clickEvent){
            var clickPt = {xCoord:clickEvent.pageX - 200, yCoord:clickEvent.pageY - 135};
            var records = self.controller.activeRecords;
            for(var i = 0; i < records.length; ++i){
                if(records[i].includesPoint(clickPt)){
                    console.log("You just clicked on the record at " + JSON.stringify(clickPt));
                    records.splice(i,1);
                    self.controller.resourcePoints += 10;
                    console.log("You just won 10 points! Now you have " + self.controller.resourcePoints + " points! Wow!");
                    --i;
                    break;
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