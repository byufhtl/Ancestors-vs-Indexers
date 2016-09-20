/**
 * Created by calvinm2 on 9/13/16.
 */

define([],function(){

    /**
     * A data container for Radial pattern pathfinding
     * @param x The x value to store
     * @param y The y value to store
     * @param lastNode The last node in the chain. DEFAULT = null.
     * @constructor RadialNode
     */
    function RadialNode(x, y, lastNode = null){
        this.x = x;
        this.y = y;
        this.last = lastNode;
    }

    /**
     * Generates a path towards a particular point based on a given radius. The path will be at most 'radius' tiles long,
     * and will try to optimize in the direction of the end point.
     * @param board The board to use for pathfinding.
     * @param startingCoords The starting coordinate set in the format {x:x, y:y}.
     * @param endingCoords The ending coordinate set in the format {x:x, y:y}.
     * @param radius The maximum path length. DEFAULT = 5.
     * @returns {Array} The preferred path in the format [{x:x, y:y},...], with coordinates in order from the starting point.
     * @private Not really private, but not something you want to call independent of the PathFinder object
     */
    function RadialFinder(board, startingCoords, endingCoords, radius = 5){
        var visited = [];
        if(!RadialFinder.isValidBoardSpace(board, startingCoords.x, startingCoords.y)){
            return []; // Maybe not the best return, since it happens only if you're off the map... Error check that before now too, just in case...
        }
        var destination = RadialFinder.radialTrace(board, radius, visited, new RadialNode(startingCoords.x, startingCoords.y), new RadialNode(endingCoords.x, endingCoords.y));
        return RadialFinder.constructTrace(destination);
    }

    /**
     * Derives the trace recorded in a given destination node by backwards iterating over the linkage in RadialNodes.
     * @param destNode The destination node.
     * @returns {Array} The trace to the destination in the format [{x:x, y:y},...]
     */
    RadialFinder.constructTrace = function(destNode){
        var trace = [];
        while(destNode){
            trace.unshift({x:destNode.x, y:destNode.y});
            destNode = destNode.last;
        }
        if(trace.length){
            trace.shift();
        }
        return trace;
    };

    /**
     * Recursively visits the nodes closest to the endpoint from the basepoint up do a radius of 'remaining'. Ultimately
     * returns the best destination node that can be traced back through to the beginning.
     * @param board The board to use in path checking
     * @param remaining The number of steps to continue searching
     * @param visited An array of visited nodes
     * @param baseNode The node with the base coordinates in it
     * @param endNode The node with the ending coordinates in it
     * @returns {*} The best destination possible
     */
    RadialFinder.radialTrace = function (board, remaining, visited, baseNode, endNode){
        if(remaining > 0){
            visited.push(baseNode);
            var neighbors = RadialFinder.getNeighbors(board, baseNode.x, baseNode.y);
            var results = [];
            for(var neighbor of neighbors){ // for every viable neighbor
                if(!RadialFinder.seekMatchingCoordinates(visited, neighbor.x, neighbor.y)) { // If not already visited
                    if (RadialFinder.getFlatProximity(neighbor, endNode) < RadialFinder.getFlatProximity(baseNode, endNode)) {
                        results.push(RadialFinder.radialTrace(board, remaining - 1, visited, new RadialNode(neighbor.x, neighbor.y, baseNode), endNode));
                    }
                }
            }
            var shortest = Number.POSITIVE_INFINITY;
            var best = null;
            for(var result of results){
                if(result != null){
                    var dist = RadialFinder.getFlatProximity(result, endNode);
                    if(dist < shortest){
                        best = result;
                        shortest = dist;
                    }
                }
            }
            return best; // Either the best node out of this path or null if there were no end points.
        }
        else{
            return baseNode;
        }
    };

    /**
     * Measures a coordinate's proximity to another coordinate. Strictly mathematical and grid based. Does not take
     * mapping into account, so it's really just a rough guess.
     * @param baseNode The base node being checked
     * @param endNode The end node being compared against
     * @returns {number} The additive distance between two nodes.
     */
    RadialFinder.getFlatProximity = function(baseNode, endNode){
        // The absolute x distance plus the absolute y distance.
        return(Math.abs(endNode.x - baseNode.x) + Math.abs(endNode.y - baseNode.y));
    };

    /**
     * Iterates through an array to ascertain if a RadialNode with matching coordinates is already in a given array.
     * @param array The array to check.
     * @param sx The x value to search for.
     * @param sy The y value to search for.
     * @returns {*} The RadialNode in question if found, otherwise null.
     */
    RadialFinder.seekMatchingCoordinates = function (array, sx, sy) {
        for(var entry of array){
            if(entry.x == sx && entry.y == sy){
                return entry;
            }
        }
        return null;
    };

    /**
     * Obtains an array of all of the valid cardinal neighbors for the node at a given position.
     * @param board The board being used as a guide.
     * @param currx The principal node's x value.
     * @param curry The principal node's y value.
     * @returns {Array} The list of direct, cardinal, valid neighbors to the given position.
     */
    RadialFinder.getNeighbors = function (board, currx, curry) {
        var neighbors = [];
        if(RadialFinder.isValidBoardSpace(board, currx, curry - 1)){
            neighbors.push({x: currx, y: curry - 1});
        }
        if(RadialFinder.isValidBoardSpace(board, currx, curry + 1)){
            neighbors.push({x: currx, y: curry + 1});
        }
        if(RadialFinder.isValidBoardSpace(board, currx - 1, curry)){
            neighbors.push({x: currx - 1, y: curry});
        }
        if(RadialFinder.isValidBoardSpace(board, currx + 1, curry)){
            neighbors.push({x: currx + 1, y: curry});
        }
        return neighbors;
    };

    /**
     * Checks the validity of the board.
     * @param board the board object being referenced.
     * @param qx The x value being queried.
     * @param qy The y value being queried.
     * @returns {boolean} Whether or not there is a valid tile at that position.
     */
    RadialFinder.isValidBoardSpace = function(board, qx, qy){
        return(!(
            qx < 0 || qy < 0 ||
            qx >= board.metaData.cols || qy >= board.metaData.rows ||
            board.tileArray[qy][qx] == null
        ))
    };

    return RadialFinder;
});