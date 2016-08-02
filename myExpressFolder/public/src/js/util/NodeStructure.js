/**
 * Created by calvin on 8/2/16.
 */

define([], function(){

    function NodeStructure(){
        this.structure = null;
    }

    NodeStructure.prototype.setAct = function(act){
        this.structure = [];
        var offset = 300;
        for (var i = 0; i < act + 1; i++) {
            var type = "alpha";
            var nodesForGeneration = [];
            var numNodes = i * 2 + 1;
            var xCoord = i * 300;
            var yCoord = - i * 150 + offset;
            for (var j = 0; j < numNodes; j++) {
                if (type == "alpha") {
                    var tempNode = {};
                    tempNode.xCoord = xCoord;
                    tempNode.yCoord = yCoord;
                    tempNode.animTimer = 0;
                    tempNode.animFrame = 0;
                    tempNode.numFrames = 50;
                    tempNode.timeBetweenFrames = .07;
                    tempNode.occupied = false;
                    tempNode.redirect = "none";
                    nodesForGeneration.push(tempNode);
                }
                yCoord += 150;
                if (type == "alpha") {
                    type = "beta";
                }
                else {
                    type = "alpha";
                }
            }
            this.structure.push(nodesForGeneration);
        }
    };

    NodeStructure.prototype.getClosestNode = function(x,y){
        var nodeStructure = this.controller.nodeStructure;
        var bestI;
        var bestJ;
        var shortestDistance = 100000;
        for (var i = 0; i < nodeStructure.length; i++)
        {
            if((nodeStructure[i][0].xCoord - x) >= -150 && (nodeStructure[i][0].xCoord - x) <= 150) {
                for (var j = 0; j < nodeStructure[i].length; j++) {
                    //replace pagx and pageY with actual click locations later on
                    var distance = Math.sqrt((nodeStructure[i][j].xCoord - clickLocation.X) * (nodeStructure[i][j].xCoord - clickLocation.X)
                        + (nodeStructure[i][j].yCoord - clickLocation.Y) * (nodeStructure[i][j].yCoord - clickLocation.Y));
                    if (distance < 50) {
                        if (distance < shortestDistance) {
                            if (!nodeStructure[i][j].occupied) {
                                shortestDistance = distance;
                                bestI = i;
                                bestJ = j;
                            }
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



    return NodeStructure;

});