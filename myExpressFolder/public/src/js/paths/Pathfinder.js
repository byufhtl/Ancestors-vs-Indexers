/**
 * Pathfinder
 *
 * This class serves as the utility belt of pathfinding. Implements an A* algorithm to find the shortest path
 * between two locations on the Board and returns the shortest path.
 * Created by calvinm2 on 9/12/16.
 */

define(["_A_star_finder"],function(AStarPath){

    function Pathfinder(){}

    /**
     * Creates a path from start to finish and returns it
     * @param board The Board Object to be used in generating a path
     * @param startingCoords The starting coordinates in the format {x:x, y:y}
     * @param endingCoords The ending coordinates in the format {x:x, y:y}
     * @return {*} Coordinate array in the format [{x:x, y:y},...]
     */
    Pathfinder.findPathTo = function(board, startingCoords, endingCoords){
        // A multitude of algorithms could be used here if desired.
        return AStarPath(board, startingCoords, endingCoords);
    };

    return Pathfinder;
});