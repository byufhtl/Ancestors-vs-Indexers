/**
 * Created by calvinm2 on 9/12/16.
 * A pathfinding system that implements a simplified A* algorithm to find the shortest path between two points.
 */

define([],function(){

    /**
     * Attempts to find a shortest path from a starting point to an ending point using an A* algorithm. The algorithm
     * works by analyzing the cost to arrive at a node and the cost to get from the beginning point and the ending point
     * by taking that node. Search algorithm is BFS.
     * @param startCoords The starting coordinates {x:x, y:y}
     * @param endCoords The ending coordinates {x:x, y:y}
     * @param board The Board Object being used.
     * @returns {Array} The coordinates to move to to follow the path. Sorted first step to last.
     * @private Not really.
     */
    function _A_star_finder(startCoords, endCoords, board){

        function PathNode(x, y, last, score = 0){
            this.x = x;
            this.y = y;
            this.last = last;
            this.scoreToNode = score;
            this.scoreByNode = 0;

            this.previous = function(){return this.last;};

            this.matchesCoords = function(mx,my){return((this.x == mx) && (this.y == my));};
            this.matchesNode = function(node){return((this.x == node.x) && (this.y == node.y));};
        }

        console.log("<<A* Algor>> Head/Tail", startCoords, endCoords);
        var start = new PathNode(startCoords.x, startCoords.y, null, 0);
        var end = new PathNode(endCoords.x, endCoords.y, null, 0);
        var closedSet = [];
        var openSet = [start];

        while(openSet.length){
            // console.log("<<A* Algor>> Head/Tail", startCoords, endCoords);
            // console.log("<<A* Algor>> OpenSet", openSet);
            // console.log("<<A* Algor>> ClosedSet", closedSet);
            var current = openSet.shift();
            if(current.matchesNode(end)){
                var tentative_path = _A_star_finder.traceBack(current);
                console.log("<<A* Algor>> TPath", tentative_path);
                return tentative_path;
            }

            closedSet.push(current); // Keep it close to the back, if possible.

            var neighbors = _A_star_finder.getNeighbors(board, current, end); // Look for the next best option.
            // console.log("<<A* Algor>> Neighbors", neighbors);
            for(var neighbor of neighbors){
                if(_A_star_finder.__seek(neighbor.x, neighbor.y, closedSet)) {continue; }
                var newScore = current.scoreToNode + neighbor.cost;
                var node = _A_star_finder.__seek(neighbor.x, neighbor.y, openSet);
                if(!node){
                    node = new PathNode(neighbor.x, neighbor.y, current, newScore);
                    // console.log("<<A* Algor>> Pushing...", node);
                    openSet.push(node);
                }
                else if(newScore >= node.scoreToNode){
                    continue;
                }
                node.scoreByNode = node.scoreToNode + _A_star_finder.heuristic(node, end);
            }

        }
        console.error("<<A* Algor>> Path Unfindable.");
        return [];
    }

    /**
     * Searches through the closedSet for any matching points.
     * @param x The x coordinate to search for.
     * @param y The y coordinate to search for.
     * @param set The set of nodes to search through
     * @returns {*} The match if found, otherwise null.
     * @private Nobody outside of this class should be using this...
     */
    _A_star_finder.__seek = function(x, y, set){
        for(var i = set.length - 1; i >= 0; i--){
            if(set[i].matchesCoords(x,y)){
                return set[i];
            }
        }
        return null;
    };

    /**
     * Determines which neighbors of a given node are valid, and evaluates the cost on making that movement. If the movement
     * is in the general direction of the
     * @param board The board (used to check for valid paths)
     * @param coords The current node.
     * @param end The end node.
     * @returns {*}
     */
    _A_star_finder.getNeighbors = function(board, coords, end){

        function evalCost(d){
            if(d < 0) return 0; // A cost that is less than 0 indicates that the choice moves us TOWARD the end
            else if(d > 0) return 2; // A positive cost indicates that we move AWAY from the end
            else return 1; // A 0 cost indicates that our movement does not move us closer or farther along the dimension.
        }
        function evalVert(ptx, pty){
            if(pty >= 0 && pty < board.metaData.rows && board.tileArray[pty][ptx] != null){ // If it's a valid array point and a node exists
                return {x: ptx, y: pty, cost: evalCost(Math.abs(end.y - pty) - Math.abs(end.y - coords.y))};
            }
            return {x: ptx, y: pty, weight: Number.POSITIVE_INFINITY};
        }
        function evalHorz(ptx, pty){
            if(ptx >= 0 && ptx < board.metaData.cols && board.tileArray[pty][ptx] != null){ // If it's a valid array point and a node exists
                    return {x: ptx, y: pty, cost: evalCost(Math.abs(end.x - ptx) - Math.abs(end.x - coords.x))};
            }
            return {x: ptx, y: pty, weight: Number.POSITIVE_INFINITY};
        }

        var up    = evalVert(coords.x, coords.y - 1);
        var down  = evalVert(coords.x, coords.y + 1);
        var left  = evalHorz(coords.x - 1, coords.y);
        var right = evalHorz(coords.x + 1, coords.y);

        var closest = [];
        if(up.cost < Number.POSITIVE_INFINITY){
            closest.push(up);
        }
        if(down.cost < Number.POSITIVE_INFINITY){
            closest.push(down);
        }
        if(left.cost < Number.POSITIVE_INFINITY){
            closest.push(left);
        }
        if(right.cost < Number.POSITIVE_INFINITY){
            closest.push(right);
        }

        // Unnecessary
        closest.sort(function(a,b){ // Sort lowest weights up towards the front.
            if(a.cost < b.cost){
                return -1;
            }
            return 1;
        });

        return closest;
    };

    /**
     * Runs a quick heuristic scan to determine how far a node is from the end point.
     * @param point The point being analyzed
     * @param end The end point
     * @returns {number}
     */
    _A_star_finder.heuristic = function(point, end){
        var yCost = Math.abs(point.y - end.y);
        var xCost = Math.abs(point.x - end.x);
        return(xCost+yCost); // May need watering down.
    };

    /**
     * Recreates the path based on the nodes used to reach the end point.
     * @param tail The end point of the path.
     * @returns {Array}
     */
    _A_star_finder.traceBack = function(tail){
        var trace = [];
        var curr = tail;
        while(curr){
            trace.unshift({x:curr.x, y:curr.y});
            console.log("Chaining", curr, "to", curr.previous());
            curr = curr.previous();
        }
        return trace;
    };

    return _A_star_finder;
});