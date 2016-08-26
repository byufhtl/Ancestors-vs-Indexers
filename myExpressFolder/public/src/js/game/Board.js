define(['game/Tile'],function(Tile) {


    function Board(){
        this.tileArray = [];
    }

    /**
     * Prints the board to the console.
     */
    Board.prototype.printTest = function(){
        Board.printArray(this.tileArray);
    };

    /**
     * Locks a clump based on two conditions:
     *      If there are fewer locks than clumps, randomly decides whether or not to lock.
     *      Otherwise will always lock the clump.
     * @return true if locked, false otherwise.
     */
    Board.prototype.__conditionalLock = function(clump, locksRemaining, clumpsRemaining){
        if(clumpsRemaining > locksRemaining){
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
        var clumps = [];
        var locksRemaining = levelData.numLocked;
        var totalLeft = levelData.numDBs + levelData.numExtraClumps;
        for(var dbi = 0; dbi < levelData.numDBs; dbi++){
            var clump = {};
            --totalLeft;
            clump.array = self.makeClump(true, levelData.clumpiness);
            console.log("Made array (DB):");
            Board.printArray(clump.array);
            console.log('END ARRAY\n\n');
            if(self.__conditionalLock(clump, locksRemaining, totalLeft)){
                Board.__lockClump(clump);
                --locksRemaining;
            }
            clumps.push(clump);
        }
        for(var clumpi = 0; clumpi < levelData.numExtraClumps; clumpi++){
            var clump = {};
            --totalLeft;
            clump.array = self.makeClump(false, levelData.clumpiness);
            console.log("Made array (OP):");
            Board.printArray(clump.array);
            console.log('END ARRAY\n\n');
            if(self.__conditionalLock(clump, locksRemaining, totalLeft)){
                Board.__lockClump(clump);
                --locksRemaining;
            }
            clumps.push(clump);
        }
        this.tileArray = Board.__bridgeIslets(Board.__merge(clumps, 4).array);
    };

    /**
     * Makes a cycle.
     */
    Board.prototype.makeCycle = function(){

    };

    /**
     * Combines cycles within a clump.
     */
    Board.prototype.combineCycles = function(){

    };

    /*
     * @param hasDatabase whether or not the clump should contain a database.
     * @param clumpiness a measure of how big and close together the clumps ought to be.
     */
    Board.prototype.makeClump = function(hasDatabase, clumpiness){    };

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
                    console.log("Islet discovered");
                    isletHeads.push({row:i, col:j});
                }
            }
        }

        return isletHeads;
    };

    Board.__bridgeIslets = function(array){
        var isletCoords = this.__identifyIslets(array);
        if(!isletCoords.length){
            console.log("No map was found in bridging the islets...");
            return null;
        }
        else if(isletCoords.length == 1){
            return array;
        }
        else{
            while(isletCoords.length > 1){
                var startHead = isletCoords.shift();
                var endHead = isletCoords.pop();
                var xDiff = endHead.col - startHead.col;
                var yDiff = endHead.row - startHead.row;
                var idx = 0; // index marker (reusable after each loop)
                var newTile = null;
                var locked = (array[startHead.row][startHead.col].locked || array[endHead.row][endHead.col].locked);
                if(xDiff > 0){
                    for(idx = 1; idx <= xDiff; idx++){
                        if(!array[startHead.row][startHead.col + idx]){
                            newTile = new Tile();
                            newTile.locked = locked;
                            array[startHead.row][startHead.col + idx] = newTile;
                        }
                    }
                }
                else if(xDiff < 0){
                    xDiff *= -1;
                    for(idx = 1; idx <= xDiff; idx++){
                        if(!array[startHead.row][startHead.col - idx]){
                            newTile = new Tile();
                            newTile.locked = locked;
                            array[startHead.row][startHead.col - idx] = newTile;
                        }
                    }
                }
                if(yDiff > 0){
                    for(idx = 1; idx <= yDiff; idx++){
                        if(!array[startHead.row + idx][startHead.col + xDiff]){
                            newTile = new Tile();
                            newTile.locked = locked;
                            array[startHead.row + idx][startHead.col + xDiff] = newTile;
                        }
                    }
                }
                else if(yDiff < 0){
                    yDiff *= -1;
                    for(idx = 1; idx <= yDiff; idx++){
                        if(!array[startHead.row - idx][startHead.col + xDiff]){
                            newTile = new Tile();
                            newTile.locked = locked;
                            array[startHead.row - idx][startHead.col + xDiff] = newTile;
                        }
                    }
                }
            }
        }
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
        var pOrders = [1,2,3,4,5,6,7,8];
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
        // End Force Orders

        console.log("<<BOARD>> Peripheral Orders:",pOrders);
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
        console.log("<<BOARD>> Copying. \n\tBase:", base, "\n\tAdd:", add, "\n\ty:", starty, "\n\tx:", startx);
        if(startx < 0 || starty < 0){
            return 0;
        }
        for(var i = 0; i <add.length; i++){
            for(var j = 0; j < add[0].length; j++){
                console.log("<<BOARD>> Attempting merge of", starty, i, startx, j);
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
                console.log("<<BOARD>> Merging", next.array, "with", glob.array, "in sector", pOrder);
                var startCoords = Board.__placeCopyPoint(pOrder, centerDim.w, centerDim.h, nextDim.w, nextDim.h, space);
                console.log("<<BOARD>> Central Metadata:", centerDim, "starting:", center_y, center_x);
                console.log("<<BOARD>> Staring Coordinates from Center:", startCoords, "(" + space + " for spacing)");
                console.log("<<BOARD>> Dimensions:", nextDim);
                var i, j;
                var newRow;
                /*
                    Adjust the total width height of the array and move the center coordinates accordingly
                 */
                console.log("<<BOARD>> Adjusting Array.\n<<BOARD>> Before:");
                Board.printArray(glob.array);

                if((centerDim.x - center_x + startCoords.x) < 0){ // If pushes left boundary
                    var leftPush = -(centerDim.x - center_x + startCoords.x);
                    centerDim.tw += leftPush; // extend width
                    centerDim.x += leftPush; // move the center
                    console.log("<<BOARD>> Pushing left boundary by", leftPush);
                    for(i = 0; i < glob.array.length; i++){
                        for( j = 0; j < leftPush ; j++){
                            glob.array[i].unshift(null);
                        }
                    }
                }
                if((centerDim.y - center_y + startCoords.y) < 0){ // If pushed top boundary
                    var topPush = -(centerDim.y - center_y + startCoords.y);
                    console.log("<<BOARD>> Pushing top boundary by", topPush);
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
                    console.log("<<BOARD>> Pushing right boundary by", rightPush);
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
                    console.log("<<BOARD>> Pushing bottom boundary by", bottomPush);
                    centerDim.th += bottomPush; // Extend bottom boundary
                    for(i = bottomPush; i > 0; i--){
                        newRow = [];
                        for(j = 0; j < centerDim.tw ; j++){
                            newRow.push(null);
                        }
                        glob.array.push(newRow);
                    }
                }
                console.log("<<BOARD>> After:");
                Board.printArray(glob.array);

                /*
                    Now that we have some room, go ahead and merge in.
                 */
                if(Board.__copyArray(glob.array, next.array, centerDim.x - center_x + startCoords.x, centerDim.y - center_y + startCoords.y)){
                    console.log("Merged arrays.");
                    Board.printArray(glob.array);
                }
                else{
                    console.log("Merge boundaries failed:", centerDim.x + startCoords.x, ",", centerDim.y + startCoords.y);
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
            console.log("<<BOARD>> Inappropriate array!");
            return;
        }
        var height = array.length;
        var width = array[0].length;
        var i = 0;
        var j = 0;
        var output = ['|'];
        for(i; i < width; i++){
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
                    output.push('#');
                }
            }
            output.push('|\n');
        }
        output.push('|');
        for(i = 0; i < width; i++){
            // console.log("<<BOARD>> output:", 9);
            output.push('-');
        }
        // console.log("<<BOARD>> output:", 10);
        output.push('|');
        // console.log("<<BOARD>> output:", output);
        console.log(output.join(""));
    };

    return Board;
});
