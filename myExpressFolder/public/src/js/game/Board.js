define(['game/Tile', 'img/ImageManager'],function(Tile, ImageManager) {


    function Board(){
        this.tileArray = [];
        this.bridgeTiles = {};
        this.databases = {};
        this.locked = {};
        this.open = {};
        this.__clumpToTile = {};
        this.clumpID = 0;
        this.playerStartingPosition = {xCoord: 0, yCoord: 0};
        this.metaData = {bridgeTileCount:0, databaseCount:0};
    }

    /**
     * Gets the tile at the given location. Returns null if the tile does not exist or if the point passed in is out
     * of the boundaries of the field.
     * @param row The row in which the desired tile resides.
     * @param col The column in which the desired tile resides.
     * @returns {*} The tile, if present, null otherwise.
     */
    Board.prototype.getTileAt = function(row, col){
        if(row < 0 || row > this.tileArray.length || col < 0 || col > this.tileArray[0].length){return null;}
        return this.tileArray[row][col];
    };

    /**
     * Prints the board to the console.
     */
    Board.prototype.printTest = function(){
        Board.printArray(this.tileArray);
        console.log("<<BOARD>> Bridge Tiles:", this.bridgeTiles);
        console.log("<<BOARD>> Database Tiles:", this.databases);
        console.log("<<BOARD>> Locked Tiles:", this.locked);
        console.log("<<BOARD>> Open Tiles:", this.open);
        console.log("<<BOARD>> Clumpings:", this.__clumpToTile);
    };

    /**
     * Locks a clump based on two conditions:
     *      If there are fewer locks than clumps, randomly decides whether or not to lock.
     *      Otherwise will always lock the clump.
     * @return true if locked, false otherwise.
     */
    Board.prototype.__conditionalLock = function(clump, locksRemaining, clumpsRemaining){
        if(clumpsRemaining > locksRemaining && locksRemaining > 0){
            clump.lock = (Math.floor(Math.random() + .5) == 1);
            return clump.lock;
        }
        else{
            clump.lock = true;
            return true;
        }
    };

    /**
     * Locks all of the Tiles in a clump
     * @param clump the clump to lock.
     * @private Nobody else locks.
     */
    Board.__lockClump = function(clump){
        var arr = clump.array;
        for(var i in arr){
            for(var j in arr[i]){
                if(arr[i][j]){
                    arr[i][j].locked = true;
                }
            }
        }
    };

    /**
     * Generates and returns the 2d array representing all board tiles
     * @param levelData {#ofDatabases, #extraClumps, #Clumpiness, #ofLockedClumps}
     */
    Board.prototype.generate = function(levelData){
        var self = this;
        this.clumpID = 0;
        this.tileArray = [];
        this.bridgeTiles = {};
        this.databases = {};
        this.locked = {};
        this.open = {};
        this.__clumpToTile = {};
        var clumps = [];
        var locksRemaining = levelData.numLocked;
        var totalLeft = levelData.numDBs + levelData.numExtraClumps;
        for(var dbi = 0; dbi < levelData.numDBs + levelData.numExtraClumps; dbi++){
            var clump = {};
            --totalLeft;
            clump = self.makeClump((dbi < levelData.numDBs), levelData.clumpiness);
            //console.log("<<BOARD>> Made Clump *v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*");
            //console.log(clump);
            Board.printArray(clump.array);
            //console.log('<<BOARD>> End Clump  *^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*');
            if(self.__conditionalLock(clump, locksRemaining, totalLeft)){
                Board.__lockClump(clump);
                --locksRemaining;
            }
            clumps.push(clump);
        }

        this.tileArray = Board.__reconnect(Board.__bridgeIslets(Board.__merge(clumps, 4).array), levelData.numDBs * 2 + levelData.numExtraClumps);
        this.scan();
        Board.setTileImages(this.tileArray);
        this.printTest();
        Board.addPlayer(this.tileArray, this.playerStartingPosition);
        Board.addRelativePositions(this.tileArray, levelData.numAncestors);
    };



    /**
     * Traverses a double array of tiles and determines their image.
     * @param tileArray The tile array to set.
     */
    Board.setTileImages = function(tileArray) {
      for (var y = 0; y < tileArray.length; y++){
          for (var x = 0; x < tileArray[y].length; x++){
              if (tileArray[y][x] != null){
                  var leftOpen = true;
                  var rightOpen = true;
                  var topOpen = true;
                  var bottomOpen = true;
                  if (y == 0 || tileArray[y - 1][x] == null) topOpen = false;
                  if (y == (tileArray.length - 1) || tileArray[y+1][x] == null) bottomOpen = false;
                  if (x == 0 || tileArray[y][x-1] == null) leftOpen = false;
                  if (x == (tileArray[y].length - 1) || tileArray[y][x+1] == null) rightOpen = false;
                  if (topOpen&&bottomOpen&&leftOpen&&rightOpen){
                    tileArray[y][x].image = ImageManager.BLU_TBLR;
                  }
                  else if (topOpen&&leftOpen&&rightOpen){
                    tileArray[y][x].image = ImageManager.BLU_TLR;
                  }
                  else if (topOpen&&bottomOpen&&rightOpen){
                    tileArray[y][x].image = ImageManager.BLU_TBR;
                  }
                  else if (topOpen&&bottomOpen&&leftOpen){
                    tileArray[y][x].image = ImageManager.BLU_TBL;
                  }
                  else if (bottomOpen&&leftOpen&&rightOpen){
                    tileArray[y][x].image = ImageManager.BLU_BLR;
                  }
                  else if (bottomOpen&&leftOpen){
                    tileArray[y][x].image = ImageManager.BLU_BL;
                  }
                  else if (bottomOpen&&rightOpen){
                    tileArray[y][x].image = ImageManager.BLU_BR;
                  }
                  else if (leftOpen&&rightOpen){
                    tileArray[y][x].image = ImageManager.BLU_LR;
                  }
                  else if (topOpen&&bottomOpen){
                    tileArray[y][x].image = ImageManager.BLU_TB;
                  }
                  else if (topOpen&&leftOpen){
                    tileArray[y][x].image = ImageManager.BLU_TL;
                  }
                  else if (topOpen&&rightOpen){
                    tileArray[y][x].image = ImageManager.BLU_TR;
                  }
                  else if (topOpen){
                    tileArray[y][x].image = ImageManager.BLU_T;
                  }
                  else if (bottomOpen){
                    tileArray[y][x].image = ImageManager.BLU_B;
                  }
                  else if (rightOpen){
                    tileArray[y][x].image = ImageManager.BLU_R;
                  }
                  else if (leftOpen){
                    tileArray[y][x].image = ImageManager.BLU_L;
                  }
                  else {
                    tileArray[y][x].image = ImageManager.BLU_ISLD;
                  }
              }
          }
      }
    };

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
    };

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
    };

    Board.lastRemainingIsOpposite = function(up,down,left,right,firstTile){
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

    /**
     * Makes a cycle.
     */
    Board.prototype.makeCycle = function(){
        var self = this;
        var cycle = [];
        //size of cycle between 2 and 5
        var size = Math.floor(Math.random() * (6-3) + 2);
        console.log("size is: ", size);
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
                if (Board.isReverse(random, previous)) randomAgain = true;
                //finally ensure that there are actually any of the direction left
                if (!Board.remaining(up, down, left, right, random)) randomAgain = true;

                //we're stuck because our last move is a reverse
                //check the remaining one is opposite
                if (Board.remainingIsOpposite(up, down, left, right, previous))
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
                cycle[row][col].clumpID = self.clumpID;
                self.__clumpToTile[self.clumpID].push({row: row, col: col});
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


    Board.addDatabase = function(array){
        while(true){
            var randomColumn = Math.floor(Math.random() * array.length);
            var randomRow = Math.floor(Math.random() * array[0].length);
            for (var i = 0; i < array.length; i++){
              if (i > randomColumn) randomColumn = Math.floor(Math.random() * (array.length - i)) + i;
              for (var j = 0; j < array.length; j++){
                if (j > randomColumn) randomRow = Math.floor(Math.random() * (array.length - j)) + j;
                if (i == randomColumn &&  j == randomRow && array[i][j] != null)
                {
                    console.log("adding a database");
                    array[i][j].database = true;
                    return;
                }
              }
            }
        }
    };

    Board.addPlayer = function(array, playerStartingPosition){
      while(true){
          var randomColumn = Math.floor(Math.random() * array.length);
          var randomRow = Math.floor(Math.random() * array[0].length);
          for (var i = 0; i < array.length; i++){
            if (i > randomColumn) randomColumn = Math.floor(Math.random() * (array.length - i)) + i;
            for (var j = 0; j < array.length; j++){
              if (j > randomColumn) randomRow = Math.floor(Math.random() * (array.length - j)) + j;
              if (i == randomColumn &&  j == randomRow && array[i][j] != null && !array[i][j].locked)
              {
                  console.log("adding a player");
                  playerStartingPosition.xCoord = j;
                  playerStartingPosition.yCoord = i;
                  array[i][j].startingPosition = true;
                  return;
              }
            }
          }
      }
    };


    Board.addRelativePositions = function(array, numAncestors){


    };



    /**
     * Creates a clump out of a number of cycles, and optionally includes a database as part of the clump.
     * @param hasDatabase whether or not a database ought to be included in the new clump
     * @param clumpiness How close together the clumps ought to be.
     */
    Board.prototype.makeClump = function(hasDatabase, clumpiness){
        var clump = {array: [], database: null};
        ++this.clumpID;
        if(!this.__clumpToTile.hasOwnProperty(this.clumpID)){
            this.__clumpToTile[this.clumpID] = [];
        }
        for(var c = 0; c < Math.floor(clumpiness* 1.5); c++){
            clump.array.push({array:this.makeCycle()});
        }
        // console.log("<<BOARD>> About to merge cycles:", clump.array);
        clump.array = Board.__bridgeIslets(Board.__merge(clump.array, -(Math.floor(Math.sqrt(clumpiness)))).array); // Works for me. :)
        // add in a database
        if (hasDatabase){
            Board.addDatabase(clump.array);
        }

        // console.log("<<BOARD>> Fresh-made clump:", clump);
        // Board.printArray(clump.array);
        return clump;
    };

    /**
     * Recursive function that determines if a given coordinate in a 2d map is the beginning of a new island, and if
     * it is marking out the contours of the new island.
     * @param map The map with the data being checked against
     * @param markup A markup of the same dimensions as the map used to track where the function has visited
     * @param starty the starting y coordinate in the array[y][x]
     * @param startx the starting x coordinate in the array[y][x]
     * @returns {boolean} Whether or not the given coordinate marked the beginning of a new island.
     * @private Nobody else needs it.
     */
    Board.__mapIslet = function (map, markup, starty, startx) {
        var curry = starty;
        var currx = startx;
        if(
            curry < markup.length && curry >= 0                 // y bounds tests
            && currx < markup[0].length && currx >= 0           // x bounds tests
            && !markup[curry][currx])                           // needs checked tests
        {
            markup[curry][currx] = 1; // mark the node in the markup array
            if(map[curry][currx]) {   // if there is anything interesting here, check neighbors and return true for hit.
                this.__mapIslet(map, markup, starty + 1, startx);
                this.__mapIslet(map, markup, starty - 1, startx);
                this.__mapIslet(map, markup, starty, startx + 1);
                this.__mapIslet(map, markup, starty, startx - 1);
                return true;
            }
        }
        return false;
    };

    /**
     * Identifies islands within an array.
     * @param array The array to search for island.
     * @returns {Array} the coordinates of the upper-left corners of the found islands.
     * @private Nobody else needs it.
     */
    Board.__identifyIslets = function(array){
        // Make an array for marking purposes.
        var markup = [];
        for(var n = 0; n < array.length; n++){
            var nrow = [];
            for(var m = 0; m < array[0].length; m++){
                nrow.push(0);
            }
            markup.push(nrow);
        }

        var isletHeads = [];
        for(var i = 0; i < array.length; i++){
            for(var j = 0; j < array[0].length; j++){
                if(this.__mapIslet(array, markup, i, j)){
                    //console.log("Islet discovered");
                    isletHeads.push({row:i, col:j});
                }
            }
        }

        return isletHeads;
    };

    /**
     * Draws a linear path between two points within a 2d array.
     * @param array The array to draw the path in
     * @param start The start point
     * @param end The end point
     * @param makeBridge Whether or not the tiles in the new path should be specifically designated as bridges
     * @returns {*} The array. Just in case you forgot that you passed it in.
     * @private Keep out of reach of children.
     */
    Board.__drawLinearPath = function(array, start, end, makeBridge){
        console.log("<<BOARD>> Drawing Additional Paths:", array, start, end);
        var error = ((array[start.row][start.col] == null) << 8);
        error &= ((array[end.row][end.col] == null) << 7);
        error &= ((array[start.row][start.col] == array[end.row][end.col]) << 6);
        if(error){
            console.log("Selected path was not buildable. Error", error);
            return array;
        }
        var xDiff = end.col - start.col;
        var yDiff = end.row - start.row;
        var curry = start.row;
        var currx = start.col;
        var idx = 0; // index marker (reusable after each loop)
        var newTile = null;
        var locked = (array[start.row][start.col].locked || array[end.row][end.col].locked);
        var printKey = Math.floor(Math.random()*7) + 2;
        array[start.row][start.col].head = true;
        array[end.row][end.col].tail = true;
        function placePath(i,j) {
            if(array[curry][currx] == null){ // Initiates a new tile.
                newTile = new Tile();
                newTile.locked = locked;
                newTile.type = printKey;
                newTile.clumpID = (makeBridge) ? 0 : (array[end.row][end.col].locked ? array[end.row][end.col].clumpID : array[start.row][start.col].clumpID);
                array[i][j] = newTile;
                            }
            else if(!locked){ // Unlocks intersections with locked paths.
                array[i][j].locked = false;
            }
        }

        if(xDiff > 0){
            for(idx = 1; idx <= xDiff; idx++){
                placePath(curry, currx = start.col + idx);
            }
        }
        else if(xDiff < 0){
            xDiff *= -1;
            for(idx = 1; idx <= xDiff; idx++){
                placePath(curry, currx = start.col - idx);
            }
        }
        if(yDiff > 0){
            for(idx = 1; idx <= yDiff; idx++){
                placePath(curry = start.row + idx, currx);
            }
        }
        else if(yDiff < 0){
            yDiff *= -1;
            for(idx = 1; idx <= yDiff; idx++){
                placePath(curry = start.row - idx, currx);
            }
        }

        return array;
    };

    /**
     * Creates path between islands on the map.
     * @param array The array to be bridged
     * @returns {*} The bridged array.
     * @private Nobody else should be using this.
     */
    Board.__bridgeIslets = function(array){
        //console.log("<<BOARD>> Attempting to bridge[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]:");
        Board.printArray(array);
        var isletCoords = this.__identifyIslets(array);
        if(!isletCoords.length){
            //console.error("No map was found for bridging the islets...");
            return null;
        }
        else if(isletCoords.length == 1){
            return array;
        }
        else{
            //console.log("<<BOARD>> Islet Heads:", isletCoords);
            while(isletCoords.length > 1){
                var startHead = isletCoords.shift();
                var endHead = isletCoords.pop();
                array = Board.__drawLinearPath(array, startHead, endHead, true);
                isletCoords.push(endHead);
            }
        }

        //console.log("<<BOARD>> Islets Bridged:");
        Board.printArray(array);
        //console.log("<<BOARD>> DONE[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]");
        return array;
    };

    /**
     * Sets up additional connections between random filled tiles on the board, marking them as bridges.
     * @param array The array to make the additions to and to compare against.
     * @param numPaths The number of additional paths to create.
     * @returns {*} The supplied array to support chain array editting calls
     * @private Nobody needs to know about this function outside of this class.
     */
    Board.__reconnect = function(array, numPaths){
        //console.log("<<BOARD>> Reconnecting:", numPaths);
        var height = array.length;
        var width = array[0].length;
        var start = {};
        var end = {};
        var y, x;
        var count = 0;
        for(var z = 0; z < numPaths; z++) {
            start = null;
            while (!start) {
                y = Math.floor(Math.random() * (height-1));
                x = Math.floor(Math.random() * (width-1));
                if (array[y][x] && array[y][x].hasOwnProperty('image')) {
                    //console.log("<<BOARD>> Reconnect message START:", array, y, x);
                    start = {row: y, col: x};
                }
            }
            end = null;
            while (!end) {
                y = Math.floor(Math.random() * height);
                x = Math.floor(Math.random() * width);
                if (array[y][x] && array[y][x].hasOwnProperty('image')) {
                    //console.log("<<BOARD>> Reconnect message: END", array, y, x);
                    end = {row: y, col: x};
                }
            }
            Board.__drawLinearPath(array, start, end, true);
            ++count;
        }
        //console.log("<<BOARD>> Reconnected", count, "times. \n<<BOARD>> Reconnected board:");
        Board.printArray(array);
        return array;
    };

    /**
     * Returns an array with the numbers 1-8 in nearly random order.
     *  1   2   3
     *  8       4
     *  7   6   5
     * @returns {number[]}
     * @private
     */
    Board.__getRandomPeripheralOrders = function(){
        var pOrders = [3,8,1,6,5,4,7,2];
        for(var i = 0; i < 16; i++){
            var j = i%8;
            var k = Math.floor(Math.random() * 8);
            var temp = pOrders[j];
            pOrders[j] = pOrders[k];
            pOrders[k] = temp;
        }

        // Force Orders:
        // pOrders = [2,3,1]; // Always grow up
        // pOrders = [4,3,5,]; // Always grow right
        // pOrders = [8,1,7,]; // Always grow left
        // pOrders.pop();
        // pOrders.pop();
        // pOrders.pop();
        // pOrders.pop();
        // End Force Orders

        //console.log("<<BOARD>> Peripheral Orders:",pOrders);
        return pOrders;
    };

    /**
     * Determines a relative starting point for the merging array by determining relative coordinates for the [0][0]
     * coordinate of the array
     *
     * @param pOrder The Peripheral Order (relative zone) in which the array is to be placed.
     * @param xPad The diameter along the width-axis to the edge of the base array from the left side of the base array.
     * @param yPad The diameter along the height-axis to the edge of the base array from the top side of the base array.
     * @param xDim The width of the array being copied.
     * @param yDim The height of the array being copied.
     * @param margin An additional distance from the center of the base to be used in calculating placement
     * @returns {{x: number, y: number}} The starting coordinates for the [0][0] coordinate of the array being copied.
     * @private We don't want this being called from anywhere else.
     *
     */
    Board.__placeCopyPoint = function(pOrder, xPad, yPad, xDim, yDim, margin){
        var dim = {x:0, y:0};
        if(pOrder > 2 && pOrder < 6){ // Right Side (3-5)
            dim.x = xPad + margin;
        }
        else if(!((pOrder-2)%4)){ // Middle (2 and 6)
            dim.x = 0;
        }
        else{ // Left (1, 7, & 8)
            dim.x = -xDim - margin;
        }
        if(pOrder > 4 && pOrder < 8){ // Bottom Side (5-7)
            dim.y = yDim + margin;
        }
        else if(!(pOrder%4)){ // Middle (4 and 8)
            dim.y = 0;
        }
        else{ // Top (1, 2, & 3)
            dim.y = -yDim - margin;
        }
        return dim;
    };

    /**
     * Copies in the values of one array into another (without overwriting existing values).
     * @param base The base array being added TO (spaces already occupied will not be overwritten)
     * @param add The array being added to the base array
     * @param startx The absolute x position where add[0][0] ought to be placed.
     * @param starty The absolute y position where add[0][0] ought to be placed.
     * @returns {number} 1 if successful, 0 if failed to merge properly.
     * @private Because it's highly adapted to the Board's setup.
     */
    Board.__copyArray = function (base, add, startx, starty) {
        // console.log("<<BOARD>> Copying. \n\tBase:", base);
        // Board.printArray(add);
        // console.log("<<BOARD>> into.", "\n\tAdd:", add);
        // Board.printArray(base);
        // console.log("<<BOARD>> y:", starty, "\tx:", startx);
        if(startx < 0 || starty < 0){
            return 0;
        }
        for(var i = 0; i <add.length; i++){
            for(var j = 0; j < add[0].length; j++){
                // console.log("<<BOARD>> Attempting merge of", starty, i, startx, j);
                if(!base[starty + i][startx + j] && add[i][j]){
                    base[starty + i][startx + j] = add[i][j];
                }
            }
        }
        return 1;
    };

    /**
     * Merges together a series of 2d arrays in a random ordering. Merge pattern places the arrays in a 3x3 block, with
     * the first array being the center block. The arrays are then pushed out by a factor determined by <space>, and then
     * merged together into a single array.
     * @param arrays an array full of 2-d arrays. If there are no 2d arrays, returns null.
     * @param space a factor of how far arrays are to be placed from each other. negative numbers introduce intrusion.
     * @private Nobody better be using this but this class.
     */
    Board.__merge = function(arrays, space){
        if(arrays.length < 1){return;}
        // console.log("<<BOARD>> Now merging:", arrays);
        var glob = arrays.shift();
        var centerDim = null;
        while(arrays.length){
            var center_x = Math.floor(glob.array[0].length/2);
            var center_y = Math.floor(glob.array.length/2);
            centerDim = {x : center_x, y: center_y, w: center_x * 2, h: center_y * 2, tw: center_x * 2, th: center_y * 2};
            var ordering = Board.__getRandomPeripheralOrders();
            while(ordering.length && arrays.length) { // prepares the next 8 arrays to merge to the base.
                var next = arrays.shift();
                var nextDim = {w: Math.floor(next.array[0].length), h: Math.floor(next.array.length)};
                var pOrder = ordering.shift();
                // console.log("<<BOARD>> Merging", next.array, "with", glob.array, "in sector", pOrder);
                var startCoords = Board.__placeCopyPoint(pOrder, centerDim.w, centerDim.h, nextDim.w, nextDim.h, space);
                // console.log("<<BOARD>> Central Metadata:", centerDim, "starting:", center_y, center_x);
                // console.log("<<BOARD>> Staring Coordinates from Center:", startCoords, "(" + space + " for spacing)");
                // console.log("<<BOARD>> Dimensions:", nextDim);
                var i, j;
                var newRow;
                /*
                    Adjust the total width height of the array and move the center coordinates accordingly
                 */

                // console.log("<<BOARD>> Adjusting Array.\n<<BOARD>> Before:");
                // Board.printArray(glob.array);

                if((centerDim.x - center_x + startCoords.x) < 0){ // If pushes left boundary
                    var leftPush = -(centerDim.x - center_x + startCoords.x);
                    centerDim.tw += leftPush; // extend width
                    centerDim.x += leftPush; // move the center
                    // console.log("<<BOARD>> Pushing left boundary by", leftPush);
                    for(i = 0; i < glob.array.length; i++){
                        for( j = 0; j < leftPush ; j++){
                            glob.array[i].unshift(null);
                        }
                    }
                }
                if((centerDim.y - center_y + startCoords.y) < 0){ // If pushed top boundary
                    var topPush = -(centerDim.y - center_y + startCoords.y);
                    // console.log("<<BOARD>> Pushing top boundary by", topPush);
                    for(i = 0; i < topPush; i++){
                        newRow = [];
                        for(j = 0; j < centerDim.tw ; j++){
                            newRow.push(null);
                        }
                        glob.array.unshift(newRow);
                    }
                    centerDim.th += topPush; // extend the height
                    centerDim.y += topPush; // move the center
                }
                if((centerDim.x - center_x + startCoords.x + nextDim.w) > centerDim.tw){ // If pushes right boundary (start + length is greater than existing width)
                    var rightPush = (centerDim.x - center_x + startCoords.x + nextDim.w) - centerDim.tw;
                    // console.log("<<BOARD>> Pushing right boundary by", rightPush);
                    centerDim.tw += rightPush; // Extend right boundary
                    for(i = 0; i < glob.array.length; i++){
                        for(j = rightPush; j > 0 ; j--){
                            glob.array[i].push(null);
                        }
                    }
                }
                // console.log("<<BOARD>> Special Report:", (centerDim.y - center_y + startCoords.y + nextDim.h) - centerDim.th);
                if((centerDim.y - center_y + startCoords.y + nextDim.h) > centerDim.th){ // If pushes lower boundary (start + depth is greater than existing depth)
                    var bottomPush = (centerDim.y - center_y + startCoords.y + nextDim.h) - centerDim.th;
                    // console.log("<<BOARD>> Pushing bottom boundary by", bottomPush);
                    centerDim.th += bottomPush; // Extend bottom boundary
                    for(i = bottomPush; i > 0; i--){
                        newRow = [];
                        for(j = 0; j < centerDim.tw ; j++){
                            newRow.push(null);
                        }
                        glob.array.push(newRow);
                    }
                }
                // console.log("<<BOARD>> After:");
                // Board.printArray(glob.array);

                /*
                    Now that we have some room, go ahead and merge in.
                 */
                if(Board.__copyArray(glob.array, next.array, centerDim.x - center_x + startCoords.x, centerDim.y - center_y + startCoords.y)){
                    // console.log("Merged arrays:");
                    // Board.printArray(glob.array);
                    // console.log("\n\n==================================================================================\n");
                }
                else{
                    console.error("Merge boundaries failed:", centerDim.x + startCoords.x, ",", centerDim.y + startCoords.y);
                }
            }
        }
        return glob;
    };

    /**
     * Prints a 2-d array.
     * @param array the array to print
     * @private
     */
    Board.printArray = function(array){
        // console.log("<<BOARD>> Printing:", array);
        if(!array || !array.length || !array[0] || !(array[0].length)){
            console.error("<<BOARD>> Inappropriate array!");
            return;
        }
        var height = array.length;
        var width = array[0].length;
        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        var output = ['|'];
        for(i = 0; i < width; i++){
            output.push((l++)%10);
        }
        output.push('|\n');
        output.push('|');
        for(i = 0; i < width; i++){
            output.push('_');
        }
        output.push('|\n');
        for(i = 0; i < height; i++){
            output.push('|');
            for(j = 0; j < width; j++){
                // console.log("<<BOARD>> output:", output, i, j);
                if(array[i][j] == null){
                    output.push(' ');
                }
                else{
                    if(array[i][j].clumpID == 0){
                        if(array[i][j].hasOwnProperty('type')) {
                            output.push(array[i][j].type);
                        }
                        else{
                            output.push('B');
                        }
                    }
                    else if(array[i][j].hasOwnProperty('head')){
                        output.push('H');
                    }
                    else if(array[i][j].hasOwnProperty('tail')){
                        output.push('T');
                    }
                    else if(array[i][j].locked == true){
                        output.push('#');
                    }
                    else{
                        output.push('O');
                    }
                }
            }
            output.push('|' + (k++) + '\n');
        }
        output.push('|');
        for(i = 0; i < width; i++){
            // console.log("<<BOARD>> output:", 9);
            output.push('-');
        }
        // console.log("<<BOARD>> output:", 10);
        output.push('|');
        // console.log("<<BOARD>> output:", output);
        //console.log(output.join(""));
    };

    Board.prototype.scan = function(){
        console.log("<<BOARD>> Commencing Scan...");
        var ccol = 0;
        var crow = 0;
        var rows = this.tileArray.length;
        var cols = this.tileArray[0].length;
        this.metaData.cols = cols;
        this.metaData.rows = rows;
        this.metaData.bridgeTileCount = 0;
        this.metaData.databaseCount = 0;
        for(ccol = 0; ccol < cols; ccol++){
            for(crow = 0; crow < rows; crow++){
                console.log("<<BOARD>> <<TILE REPORT>>", crow + "/" + rows, ccol + "/" + cols/*, "(" + this.tileArray[ccol].length + ")"*/);
                var ctile = this.tileArray[ccol][crow];
                if(ctile != null){
                    if(ctile.clumpID == 0){
                        if(!this.bridgeTiles[ccol]){
                            this.bridgeTiles[ccol] = {};
                        }
                        this.bridgeTiles[ccol][crow] = ctile;
                        ++this.metaData.bridgeTileCount;
                    }
                    if(ctile.database){
                        if(!this.databases[ccol]){
                            this.databases[ccol] = {};
                        }
                        this.databases[ccol][crow] = ctile;
                        ++this.metaData.databaseCount;
                    }
                }
            }
        }
        console.log("<<BOARD>> Scan Complete!");
    };

    return Board;
});
