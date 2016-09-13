/**
 * Pathfinder
 *
 * This class serves as the utility belt of pathfinding. Implements an A* algorithm to find the shortest path
 * between two locations on the Board and returns the shortest path.
 * Created by calvinm2 on 9/12/16.
 */

define(["paths/_A_star_finder","paths/_Radial_finder"],function(AStarPath, RadiusPath){

    function Pathfinder(){}

    /**
     * Creates a path from start to finish and returns it.
     * Primarily used to abstract and blackbox pathfinding algorithms.
     * @param board The Board Object to be used in generating a path.
     * @param startingCoords The starting coordinates in the format {x:x, y:y}.
     * @param endingCoords The ending coordinates in the format {x:x, y:y}.
     * @return {*} Coordinate array in the format [{x:x, y:y},...].
     */
    Pathfinder.prototype.findPathTo = function(board, startingCoords, endingCoords){
        // A multitude of algorithms could be used here if desired.
        return AStarPath(board, startingCoords, endingCoords);
    };

    /**
     * Creates a path from start towards the finish and returns it.
     * Primarily used to abstract and blackbox pathfinding algorithms.
     * @param board The Board Object to be used in generating a path.
     * @param startingCoords The starting coordinates in the format {x:x, y:y}.
     * @param endingCoords The ending coordinates in the format {x:x, y:y}.
     * @param length The length of the path going towards the destination. DEFAULT = 5.
     * @return {*} Coordinate array in the format [{x:x, y:y},...].
     */
    Pathfinder.prototype.findPathToward = function(board, startingCoords, endingCoords, length = 5){
        return RadiusPath(board, startingCoords, endingCoords, length);
    };

    Pathfinder.prototype.getWanderPath = function(board, startingCoords, length = 5){

    };

    return Pathfinder;
});