define(['game/Tile', 'img/ImageManager', "game/board/BoardUtils", "game/board/City"],function(Tile, ImageManager, BoardUtils,City) {

    /**
     * A class for creating a two-dimensional board of tiles for play in the game. The board's functionality is all
     * push out with the .generate() method. This constructor just declares a few class variables that will be used
     * throughout.
     *
     * @constructor The initilization of certain key class variables for later reference in board generation.
     */
    function Board(){
        this.tileArray = [];
        this.tileCoordList = [];
        this.bridgeTiles = {};
        this.databaseLocations = {};
        this.dbCoords = [];
        this.locked = {};
        this.open = {};
        this.key = {xCoord: 0, yCoord: 0};
        this.__clumpToTile = {};
        this.clumpID = 0;
        this.playerStartingPosition = {xCoord: 0, yCoord: 0};
        this.metaData = {bridgeTileCount:0, databaseCount:0, rows:0, cols:0, numClumps:0};
        this.ancestorStartingPositions = [];
        this.databaseTiles = [];
    }

    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    // BOARD GENERATION AND MANAGEMENT [][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]>

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    /**
     * Generates and returns the 2d array representing all board tiles
     * @param levelData {#ofdatabaseLocations, #extraClumps, #Clumpiness, #ofLockedClumps}
     */
    Board.prototype.generate = function(levelData){
        var self = this;
        this.levelData = levelData;
        this.clumpID = 0;
        this.tileArray = [];
        this.tileCoordList = [];
        this.bridgeTiles = {};
        this.databaseLocations = {};
        this.locked = {};
        this.open = {};
        this.__clumpToTile = {};
        var clumps = [];
        var locksRemaining = levelData.numLocked;
        var totalLeft = levelData.numDBs + levelData.numExtraClumps;
        this.metaData.numClumps = totalLeft;
        for(var dbi = 0; dbi < levelData.numDBs + levelData.numExtraClumps; dbi++){
            var clump = {};
            --totalLeft;
            clump = self.makeClump((dbi < levelData.numDBs), levelData.clumpiness);
            //console.log("<<BOARD>> Made Clump *v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*v*");
            //console.log(clump);
            BoardUtils.printArray(clump.array);
            //console.log('<<BOARD>> End Clump  *^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*');
            if(self.__conditionalLock(clump, locksRemaining, totalLeft)){
                Board.__lockClump(clump);
                --locksRemaining;
            }
            clumps.push(clump);
        }
        this.tileArray = BoardUtils.merge(clumps, 4).array;
        this.tileArray = Board.__bridgeIslets(this.tileArray, false);
        this.tileArray = Board.__bridgeIslets(this.tileArray, true);
        this.tileArray = BoardUtils.reconnect(this.tileArray, levelData.numDBs * 2 + levelData.numExtraClumps);
        this.scan();
        Board.setTileImages(this.tileArray);
        this.printTest();
        this.addPlayer(this.tileArray, this.playerStartingPosition, levelData.numDBs + levelData.numExtraClumps);
        this.addPlayer(this.tileArray, this.key, levelData.numDBs + levelData.numExtraClumps);
        this.addAncestors(levelData.numDBs + levelData.numExtraClumps, levelData.numAncestors);



        // TEMP

        var city = new City();
        city.generate(levelData);

        /// END TEMP
        console.log("databaseLocations", this.databaseLocations);
    };

    /**
     * Gets the tile at the given location. Returns null if the tile does not exist or if the point passed in is out
     * of the boundaries of the field.
     * @param row The row in which the desired tile resides.
     * @param col The column in which the desired tile resides.
     * @returns {*} The tile, if present, null otherwise.
     */
    Board.prototype.getTileAt = function(row, col){
        if(row < 0 || row > this.metaData.rows || col < 0 || col > this.metaData.cols){return null;}
        return this.tileArray[row][col];
    };

    /**
     * Prints the board to the console, along with metadata and statistics about the board.
     */
    Board.prototype.printTest = function(showBoard){
        if(showBoard) {
            BoardUtils.printArray(this.tileArray);
        }
        console.log("<<BOARD>> Metadata:", this.metaData);
        console.log("<<BOARD>> Bridge Tiles:", this.bridgeTiles);
        console.log("<<BOARD>> Database Tiles:", this.databaseLocations);
        console.log("<<BOARD>> Locked Tiles:", this.locked);
        console.log("<<BOARD>> Open Tiles:", this.open);
        console.log("<<BOARD>> Clumpings:", this.__clumpToTile);
        console.log("<<BOARD>> Tile Coord List:", this.tileCoordList);
    };

    /**
     * Scans through the internal tile array to establish certain metrics and populate the metadata object
     */
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
        this.tileCoordList = [];
        for(crow = 0; crow < rows; crow++){
            for(ccol = 0; ccol < cols; ccol++){
                // console.log("<<BOARD>> <<TILE REPORT>>", crow + "/" + rows, ccol + "/" + cols/*, "(" + this.tileArray[ccol].length + ")"*/);
                var ctile = this.tileArray[crow][ccol];
                if(ctile != null){
                    ctile.xPos = ccol;
                    ctile.yPos = crow;
                    if(ctile.clumpID == 0){
                        if(!this.bridgeTiles[crow]){
                            this.bridgeTiles[crow] = {};
                        }
                        this.bridgeTiles[crow][ccol] = ctile;
                        ++this.metaData.bridgeTileCount;

                        // Assign to the 0 clump.
                        if(!this.__clumpToTile[0]){
                            this.__clumpToTile[0] = [];
                        }
                        this.__clumpToTile[0].push({row: crow, col: ccol});
                    }
                    else{
                        if(!this.__clumpToTile[ctile.clumpID]){
                            this.__clumpToTile[ctile.clumpID] = [];
                        }
                        this.__clumpToTile[ctile.clumpID].push({row: crow, col: ccol});
                    }
                    if(ctile.database){
                        this.databaseTiles.push(ctile);
                        if(!this.databaseLocations[crow]){
                            this.databaseLocations[crow] = {};
                        }
                        this.databaseLocations[crow][ccol] = ctile;
                        ++this.metaData.databaseCount;
                    }
                    if(ctile.locked){
                        if(!this.locked[crow]){
                            this.locked[crow] = {};
                        }
                        this.locked[crow][ccol] = ctile;
                    }
                    else{
                        if(!this.open[crow]){
                            this.open[crow] = {};
                        }
                        this.open[crow][ccol] = ctile;
                    }
                    this.tileCoordList.push({row: crow, col: ccol});
                }
            }
        }
        console.log("<<BOARD>> Scan Complete!");
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




    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    // CYCLE GENERATION AND MANAGEMENT [][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]>

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    /**
     * Makes a cycle.
     */
    Board.prototype.makeCycle = function(){
        var self = this;
        var cycle = [];
        //size of cycle between 2 and 5
        var size = Math.floor(Math.random() * (13) + 2);
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




    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    // CLUMP GENERATION AND MANAGEMENT [][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]>

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    /**
     * Creates a clump out of a number of cycles, and optionally includes a database as part of the clump.
     * @param hasDatabase whether or not a database ought to be included in the new clump
     * @param clumpiness How close together the clumps ought to be.
     */
    Board.prototype.makeClump = function(hasDatabase, clumpiness){
        var clump = {array: [], database: null};
        ++this.clumpID;
        for(var c = 0; c < Math.floor(clumpiness* 1.5 + 1); c++){
            clump.array.push({array:this.makeCycle()});
        }
        // console.log("<<BOARD>> About to merge cycles:", clump.array);
        clump.array = Board.__bridgeIslets(BoardUtils.merge(clump.array, -(Math.floor(Math.sqrt(clumpiness)))).array); // Works for me. :)
        // add in a database
        if (hasDatabase){
            Board.addDatabase(clump.array, this.levelData);
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
    Board.prototype.__conditionalLock = function(clump, locksRemaining, clumpsRemaining){
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



    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    // MISCELLANEOUS FUNCTIONALITY [][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]>

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    // Pieces

    Board.addDatabase = function(array, levelData){
        while(true){
            var randomColumn = Math.floor(Math.random() * array.length);
            var randomRow = Math.floor(Math.random() * array[0].length);
            for (var i = 0; i < array.length; i++){
                if (i > randomColumn) randomColumn = Math.floor(Math.random() * (array.length - i)) + i;
                for (var j = 0; j < array.length; j++){
                    if (j > randomColumn) randomRow = Math.floor(Math.random() * (array.length - j)) + j;
                    if (i == randomColumn &&  j == randomRow && array[i][j] != null)
                    {
                        // console.log("adding a database");
                        array[i][j].database = true;
                        array[i][j].numRecords = levelData.numAncestors/levelData.numDBs;
                        return;
                    }
                }
            }
        }
    };

    Board.prototype.addPlayer = function(array, playerStartingPosition, numClumps){

        var randomClump = this.__clumpToTile[Math.floor(Math.random()*numClumps + 1)];
        while (array[randomClump[0].row][randomClump[0].col].locked){
          var randomClump = this.__clumpToTile[Math.floor(Math.random()*numClumps + 1)];
        }

        var randomCoords = randomClump[Math.floor(Math.random()*randomClump.length)];

        playerStartingPosition.yCoord = randomCoords.row;
        playerStartingPosition.xCoord = randomCoords.col;
        array[randomCoords.row][randomCoords.col].startingPosition = true;
    };

    Board.prototype.addAncestors = function(numClumps, numAncestors){
        var numAncestorsPerClump = numAncestors/numClumps;
        for (var i = 1; i <= numClumps; i++){
            for (var j = 0; j < numAncestorsPerClump; j++){
                var randomClump = this.__clumpToTile[i];
                var randomCoords = randomClump[Math.floor(Math.random()*randomClump.length)];
                this.ancestorStartingPositions.push({row:randomCoords.row,col:randomCoords.col});
                this.tileArray[randomCoords.row][randomCoords.col].ancestorStartingPosition = true;
            }
        }
    };




    // Islands

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
    Board.__mapIslet = function (map, markup, starty, startx, mapOnlyUnlockedTile) {
        var curry = starty;
        var currx = startx;
        if(
            curry < markup.length && curry >= 0                 // y bounds tests
            && currx < markup[0].length && currx >= 0           // x bounds tests
            && !markup[curry][currx])                           // needs checked tests
        {
            markup[curry][currx] = 1; // mark the node in the markup array
            if(map[curry][currx]) {   // if there is anything interesting here, check neighbors and return true for hit.
                if((!mapOnlyUnlockedTile || !map[curry][currx].locked)){
                    this.__mapIslet(map, markup, starty + 1, startx);
                    this.__mapIslet(map, markup, starty - 1, startx);
                    this.__mapIslet(map, markup, starty, startx + 1);
                    this.__mapIslet(map, markup, starty, startx - 1);
                }
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
    Board.__identifyIslets = function(array, mapOnlyUnlockedTile){
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
                if(this.__mapIslet(array, markup, i, j, mapOnlyUnlockedTile)){
                    //console.log("Islet discovered");
                    isletHeads.push({row:i, col:j});
                }
            }
        }

        return isletHeads;
    };

    /**
     * Creates path between islands on the map.
     * @param array The array to be bridged
     * @returns {*} The bridged array.
     * @private Nobody else should be using this.
     */
    Board.__bridgeIslets = function(array, bridgeUnlockedTiles){
        //console.log("<<BOARD>> Attempting to bridge[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]:");
        BoardUtils.printArray(array);
        var isletCoords = this.__identifyIslets(array, bridgeUnlockedTiles);
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
                array = BoardUtils.drawLinearPath(array, startHead, endHead, true);
                isletCoords.push(endHead);
            }
        }

        //console.log("<<BOARD>> Islets Bridged:");
        BoardUtils.printArray(array);
        //console.log("<<BOARD>> DONE[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]");
        return array;
    };





    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ END OF CLASS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


    return Board;
});
