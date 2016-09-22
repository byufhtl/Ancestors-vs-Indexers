/**
 * Created by calvinm2 on 9/19/16.
 */

define(["game/Tile"], function(Tile){

    function RCPair(row, col){
        this.row = row;
        this.col = col;
        this.y = row;
        this.x = col;
        this.yCoord = row;
        this.xCoord = col;
    }

    function BoardUtils(){}

    // Board creation

    BoardUtils.makeBoard = function(w, h, fillAll){
        var arr = [];for (var i = 0; i < (h); i++){
            var temp = [];
            for (var j = 0; j < (w); j++){
                if(fillAll){
                    temp.push(new Tile());
                }
                else {
                    temp.push(null);
                }
            }
            arr.push(temp);
        }
        return arr;
    };

    BoardUtils.genPair = function(x,y){
        return new RCPair(y,x);
    };

    // Board Merging

    /**
     * Returns an array with the numbers 1-8 in nearly random order.
     *  1   2   3
     *  8       4
     *  7   6   5
     * @returns {number[]}
     * @private
     */
    BoardUtils.getRandomPeripheralOrders = function(){
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
    BoardUtils.placeCopyPoint = function(pOrder, xPad, yPad, xDim, yDim, margin){
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
     * @private Because it's highly adapted to the board's setup.
     */
    BoardUtils.copyArray = function (base, add, startx, starty) {
        // console.log("<<BOARD>> Copying. \n\tBase:", base);
        // board.printArray(add);
        // console.log("<<BOARD>> into.", "\n\tAdd:", add);
        // board.printArray(base);
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
    BoardUtils.merge = function(arrays, space){
        if(arrays.length < 1){return;}
        // console.log("<<BOARD>> Now merging:", arrays);
        var glob = arrays.shift();
        var centerDim = null;
        while(arrays.length){
            var center_x = Math.floor(glob.array[0].length/2);
            var center_y = Math.floor(glob.array.length/2);
            centerDim = {x : center_x, y: center_y, w: center_x * 2, h: center_y * 2, tw: center_x * 2, th: center_y * 2};
            var ordering = BoardUtils.getRandomPeripheralOrders();
            while(ordering.length && arrays.length) { // prepares the next 8 arrays to merge to the base.
                var next = arrays.shift();
                var nextDim = {w: Math.floor(next.array[0].length), h: Math.floor(next.array.length)};
                var pOrder = ordering.shift();
                // console.log("<<BOARD>> Merging", next.array, "with", glob.array, "in sector", pOrder);
                var startCoords = BoardUtils.placeCopyPoint(pOrder, centerDim.w, centerDim.h, nextDim.w, nextDim.h, space);
                console.log("<<BOARDUTILS>> Central Metadata:", centerDim, "starting:", center_y, center_x);
                console.log("<<BOARDUTILS>> Staring Coordinates from Center:", startCoords, "(" + space + " for spacing)");
                console.log("<<BOARDUTILS>> Dimensions:", nextDim);
                var i, j;
                var newRow;
                /*
                 Adjust the total width height of the array and move the center coordinates accordingly
                 */

                // console.log("<<BOARD>> Adjusting Array.\n<<BOARD>> Before:");
                // board.printArray(glob.array);

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
                // board.printArray(glob.array);

                /*
                 Now that we have some room, go ahead and merge in.
                 */
                if(BoardUtils.copyArray(glob.array, next.array, centerDim.x - center_x + startCoords.x, centerDim.y - center_y + startCoords.y)){
                    // console.log("Merged arrays:");
                    // board.printArray(glob.array);
                    // console.log("\n\n==================================================================================\n");
                }
                else{
                    console.error("Merge boundaries failed:", centerDim.x + startCoords.x, ",", centerDim.y + startCoords.y);
                }
            }
        }
        return glob;
    };



    // Pathing

    /**
     * Draws a linear path between two points within a 2d array.
     * @param array The array to draw the path in
     * @param start The start point
     * @param end The end point
     * @param makeBridge Whether or not the tiles in the new path should be specifically designated as bridges
     * @returns {*} The array. Just in case you forgot that you passed it in.
     * @private Keep out of reach of children.
     */
    BoardUtils.drawLinearPath = function(array, start, end, makeBridge){
        // console.log("<<BOARD>> Drawing Additional Paths:", array, start, end);
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
     * Sets up additional connections between random filled tiles on the board, marking them as bridges.
     * @param array The array to make the additions to and to compare against.
     * @param numPaths The number of additional paths to create.
     * @returns {*} The supplied array to support chain array editting calls
     * @private Nobody needs to know about this function outside of this class.
     */
    BoardUtils.reconnect = function(array, numPaths){
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
            BoardUtils.drawLinearPath(array, start, end, true);
            ++count;
        }
        //console.log("<<BOARD>> Reconnected", count, "times. \n<<BOARD>> Reconnected board:");
        BoardUtils.printArray(array);
        return array;
    };



    // Print and Miscellaneous Features

    /**
     * Prints a 2-d array.
     * @param array the array to print
     */
    BoardUtils.printArray = function(array){
        // console.log("<<BOARD>> Printing:", array);
        if(!array || !array.length || !array[0] || !(array[0].length)){
            console.error("<<BOARDUTILS>> Inappropriate array!");
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
            width = array[i].length;
            for(j = 0; j < width; j++){
                // console.log("<<BOARD>> output:", output, i, j);
                if(array[i][j] == null){
                    output.push(' ');
                }
                else{
                    if(array[i][j].hasTypeOR(Tile.SOURCE)) {
                        output.push('S');
                    }
                    else if(array[i][j].hasTypeOR(Tile.FAST)){
                        output.push('F');
                    }
                    else if(array[i][j].hasTypeOR(Tile.NORMAL)) {
                        output.push('N');
                    }
                    else if(array[i][j].hasTypeOR(Tile.SLOW)) {
                        output.push('C');
                    }
                    else if(array[i][j].hasTypeOR(Tile.ENDPOINT)) {
                        output.push('D');
                    }
                    else if(array[i][j].hasTypeOR(Tile.PORTAL)) {
                        output.push('P');
                    }
                    else if(array[i][j].hasTypeOR(Tile.ENVIRONMENT)) {
                        output.push('L');
                    }
                    else if(array[i][j].clumpID == 0){
                        output.push('B');
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
        console.log(output.join(""));
    };

    BoardUtils.isOnBoard = function(row, col, arr){
        return(!(
            col < 0 || row < 0 ||
            row >= arr.length || col >= arr[col].length ||
            arr[row][col] == null
        ))
    };

    BoardUtils.getNeighbors = function(row, col, arr){
        var results = [];
        if(BoardUtils.isOnBoard(row - 1, col, arr)){
            results.push(new RCPair(row-1, col));
        }
        if(BoardUtils.isOnBoard(row + 1, col, arr)){
            results.push(new RCPair(row+1, col));
        }
        if(BoardUtils.isOnBoard(row, col - 1, arr)){
            results.push(new RCPair(row, col-1));
        }
        if(BoardUtils.isOnBoard(row, col + 1, arr)){
            results.push(new RCPair(row, col+1));
        }
        return results;
    };


    return BoardUtils;
});