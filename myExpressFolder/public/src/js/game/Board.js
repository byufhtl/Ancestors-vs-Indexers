define(['game/Tile'],function(Tile) {


    function Board(){
        this.tileArray = [];
    }


    /**
     * Generates and returns the 2d array representing all board tiles
     * @param levelData {#ofDatabases, #extraClumps, #Clumpiness, #ofLockedClumps}
     */
    Board.prototype.generate = function(levelData){
        var self = this;
        var clumps = [];
        for(var dbi = 0; dbi < levelData.numDatabase; dbi++){
            var clump = {};
            clump.array = self.makeClump(true);

            /*
             * Make a clump with a DB in it
             * Add it to the field.
             */
        }
        for(var clumpi = 0; clumpi < levelData.numAdditionalClumps; clumpi++){
            /*
             * Make a database-free clump
             * Add it to the field.
             */
        }
        /*
            Combine clumps
        */
    };

    /**
     * Makes a cycle.
     */
    Board.isReverse = function(random, previousDirection){
        var reverse = false;
        if (previousDirection == 1 && random == 2) reverse = true;
        else if (previousDirection == 2 && random == 1) reverse = true;
        else if (previousDirection == 3 && random == 4) reverse = true;
        else if (previousDirection == 4 && random == 3) reverse = true;

        return reverse;
    };

    Board.remaining = function(up, down, left, right, random){
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
    }

    Board.remainingIsOpposite = function(up,down,left,right,previous){
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
    }

    Board.prototype.makeCycle = function(){
        var cycle = [];
        //size of cycle between 2 and 5
        var size = Math.floor(Math.random() * (6-2) + 2);
        console.log("size is: ", size);
        for (var i = 0; i < (size*2+1); i++){
          var temp = [];
          for (var j = 0; j < (size*2+1); j++){
            temp.push(null);
          }
          cycle.push(temp);
        }
        console.log("cycle",cycle);
        var up = size;
        var down = size;
        var left = size;
        var right = size;

        var yPos = size;
        var xPos = size;

        cycle[yPos][xPos] = new Tile();

        var random = Math.floor(Math.random() * (5-1) + 1);

        while (up > 0 || down > 0 || left > 0 || right > 0) {
            var randomAgain = true;
            var previous = random;
            while (randomAgain){
                randomAgain = false;

                random = Math.floor(Math.random() * (5-1) + 1);

                //can't go in reverse direction because it can create a lane
                if (Board.isReverse(random, previous)) randomAgain = true;
                //finally ensure that there are actually any of the direction left
                if (!Board.remaining(up, down, left, right, random)) randomAgain = true;

                //we're stuck because our last move is a reverse
                //check the remaining one is opposite
                if (Board.remainingIsOpposite(up, down, left, right, previous))
                {
                        if (previous == 1 || previous == 2){
                          console.log("right left incremented");
                          right++; left++;
                        }
                        else if (previous == 3 || previous == 4){
                          console.log("up down incremented");
                          up++; down++;
                        }
                }
            }

            switch(random){
                case 1: //up
                    console.log("up");
                    yPos++;
                    up--;
                    cycle[yPos][xPos] = new Tile();
                    break;
                case 2: //down
                    console.log("down");
                    yPos--;
                    down--;
                    cycle[yPos][xPos] = new Tile();
                    break;
                case 3: //left
                    console.log("left");
                    xPos--;
                    left--;
                    cycle[yPos][xPos] = new Tile();
                    break;
                case 4: //right
                    console.log("right");
                    xPos++;
                    right--;
                    cycle[yPos][xPos] = new Tile();
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

        console.log("cycle", cycle);
    };

    /**
     * Combines cycles within a clump.
     */
    Board.prototype.combineCycles = function(){

    };

    /*
     * @param hasDatabase whether or not the clump should contain a database.
     */
    Board.prototype.makeClump = function(hasDatabase){

    };

    /**
     * Adds a clump and any necessary bridging to connect it to the other clumps.
     */
    Board.prototype.addClump = function(clumpToAdd){

    };

    return Board;
});
