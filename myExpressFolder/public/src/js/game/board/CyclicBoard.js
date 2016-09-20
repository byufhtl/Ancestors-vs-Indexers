/**
 * Created by calvinm2 on 9/19/16.
 */

define(["game/Tile"],function(GameTile){

    function CyclicBoard(){

    }

    CyclicBoard.prototype.GenerateClumps = function(leveldata){

    };


    // CYCLES

    CyclicBoard.makeCycle = function(clumpId){
        var cycle = [];
        //size of cycle between 2 and 5
        var size = Math.floor(Math.random() * (12-3) + 2);
        // console.log("size is: ", size);
        //console.log("size is: ", size);
        for (var i = 0; i < (size*2+1); i++){
            var temp = [];
            for (var j = 0; j < (size*2+1); j++){
                temp.push(null);
            }
            cycle.push(temp);
        }
        var up = size;
        var down = size;
        var left = size;
        var right = size;

        var yPos = size;
        var xPos = size;

        cycle[yPos][xPos] = new Tile();
        var firstMove = null;
        var random = Math.floor(Math.random() * (5-1) + 1);

        while (up > 0 || down > 0 || left > 0 || right > 0) {
            var randomAgain = true;
            var previous = random;
            while (randomAgain){
                randomAgain = false;

                random = Math.floor(Math.random() * (5-1) + 1);

                if (Board.lastRemainingIsOpposite(up,down,left,right,firstMove)){
                    if (up == 1 || down == 1){
                        left++; right++;
                        random = 3;
                    }
                    else{
                        up++; down++;
                        random = 1;
                    }
                }
                //can't go in reverse direction because it can create a lane
                if (CyclicBoard.isReverse(random, previous)) randomAgain = true;
                //finally ensure that there are actually any of the direction left
                if (!CyclicBoard.remaining(up, down, left, right, random)) randomAgain = true;

                //we're stuck because our last move is a reverse
                //check the remaining one is opposite
                if (CyclicBoard.remainingIsOpposite(up, down, left, right, previous))
                {
                    if (previous == 1 || previous == 2){
                        //console.log("right left incremented");
                        right++; left++;
                    }
                    else if (previous == 3 || previous == 4){
                        //console.log("up down incremented");
                        up++; down++;
                    }
                }
            }
            if (firstMove == null) firstMove = random;
            function genTile(row, col){
                cycle[row][col] = new Tile();
                cycle[row][col].clumpID = clumpID;
            }
            switch(random){
                case 1: //up
                    yPos++;
                    up--;
                    genTile(yPos, xPos);
                    break;
                case 2: //down
                    yPos--;
                    down--;
                    genTile(yPos, xPos);
                    break;
                case 3: //left
                    xPos--;
                    left--;
                    genTile(yPos, xPos);
                    break;
                case 4: //right
                    xPos++;
                    right--;
                    genTile(yPos, xPos);
                    break;
            }

        }

        //ok, we have an array, but it's 2 times too big.
        //lets chop off the parts we don't need
        //chop out rows

        var checkColumns = Array(size).fill("empty");
        for (var y = 0; y < cycle.length; y++){
            var chopRow = true;
            for (var x = 0; x < cycle[y].length; x++){
                if (cycle[y][x] != null) {
                    chopRow = false;
                    checkColumns[x] = "full";
                }
            }
            if (chopRow) {
                cycle.splice(y, 1);
                y--;
            }
        }

        for (var i = 0; i < checkColumns.length; i++){
            if (checkColumns[i] == "empty"){
                for (var y = 0; y < cycle.length; y++){
                    cycle[y].splice(i,1);
                }
                checkColumns.splice(i, 1);
                i--;
            }
        }

        //console.log("cycle", cycle);
        return cycle;
    };

    CyclicBoard.isReverse = function(random, previousDirection){
        var reverse = false;
        if (previousDirection == 1 && random == 2) reverse = true;
        else if (previousDirection == 2 && random == 1) reverse = true;
        else if (previousDirection == 3 && random == 4) reverse = true;
        else if (previousDirection == 4 && random == 3) reverse = true;

        return reverse;
    };

    CyclicBoard.remaining = function(up, down, left, right, random){
        switch(random){
            case 1: //up
                if (up <= 0) return false;
                break;
            case 2: //down
                if (down <= 0) return false;
                break;
            case 3: //left
                if (left <= 0) return false;
                break;
            case 4: //right
                if (right <= 0) return false;
                break;
        }
        return true;
    };

    CyclicBoard.remainingIsOpposite = function(up,down,left,right,previous){
        switch(previous) {
            case 1: //up
                if (up == 0 && right == 0 && left == 0 && down >= 1) return true;
                break;
            case 2: //down
                if (right == 0 && left == 0 && down == 0 && up >= 1) return true;
                break;
            case 3: //left
                if (left == 0 && down == 0 && up == 0 && right >= 1) return true;
                break;
            case 4: //right
                if (down == 0 && up == 0 && right == 0 && left >= 1) return true;
                break;
        }
        return false;
    };

    CyclicBoard.lastRemainingIsOpposite = function(up,down,left,right,firstTile){
        switch(firstTile) {
            case 1: //up
                if (up == 0 && right == 0 && left == 0 && down == 1) return true;
                break;
            case 2: //down
                if (right == 0 && left == 0 && down == 0 && up == 1) return true;
                break;
            case 3: //left
                if (left == 0 && down == 0 && up == 0 && right == 1) return true;
                break;
            case 4: //right
                if (down == 0 && up == 0 && right == 0 && left == 1) return true;
                break;
        }
        return false;
    };


    //CLUMPS


    /**
     * Creates a clump out of a number of cycles, and optionally includes a database as part of the clump.
     * @param hasDatabase whether or not a database ought to be included in the new clump
     * @param clumpiness How close together the clumps ought to be.
     */
    CyclicBoard.prototype.makeClump = function(hasDatabase, clumpiness, levelData, clumpId){
        var clump = {array: [], database: null};
        for(var c = 0; c < Math.floor(clumpiness* 1.5 + 1); c++){
            clump.array.push({array:CyclicBoard.makeCycle(clumpId)});
        }
        // console.log("<<BOARD>> About to merge cycles:", clump.array);
        clump.array = CyclicBoard.__bridgeIslets(CyclicBoard.__merge(clump.array, -(Math.floor(Math.sqrt(clumpiness)))).array); // Works for me. :)
        // add in a database
        if (hasDatabase){
            CyclicBoard.addDatabase(clump.array, levelData);
        }

        // console.log("<<BOARD>> Fresh-made clump:", clump);
        // board.printArray(clump.array);
        return clump;
    };

    /**
     * Locks a clump based on two conditions:
     *      If there are fewer locks than clumps, randomly decides whether or not to lock.
     *      Otherwise will always lock the clump.
     * @return true if locked, false otherwise.
     */
    CyclicBoard.prototype.__conditionalLock = function(clump, locksRemaining, clumpsRemaining){
        if(locksRemaining > 0) {
            if (clumpsRemaining > locksRemaining) { clump.lock = (Math.floor(Math.random() + .5) == 1); }
            else { clump.lock = true; }
        }
        else{ clump.lock = false; }
        return clump.lock;
    };

    /**
     * Locks all of the Tiles in a clump
     * @param clump the clump to lock.
     * @private Nobody else locks.
     */
    CyclicBoard.__lockClump = function(clump){
        var arr = clump.array;
        for(var i in arr){
            for(var j in arr[i]){
                if(arr[i][j]){
                    arr[i][j].locked = true;
                }
            }
        }
    };


    // MISCELLANEOUS
    CyclicBoard.addDatabase = function(array, leveldata){

    };

    return CyclicBoard;
});