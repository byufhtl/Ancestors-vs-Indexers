define(['game/Tile'],function(Tile) {


    function Board(){
        this.tileArray = [];
    }

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
            if(self.__conditionalLock(clump, locksRemaining, totalLeft)){--locksRemaining;}
            self.addClump(clump, clumps);
        }
        for(var clumpi = 0; clumpi < levelData.numExtraClumps; clumpi++){
            var clump = {};
            --totalLeft;
            clump.array = self.makeClump(false, levelData.clumpiness);
            if(self.__conditionalLock(clump, locksRemaining, totalLeft)){--locksRemaining;}
            self.addClump(clump, clumps);
        }
        this.tileArray = Board.__merge(clumps, 4);
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
    Board.prototype.makeClump = function(hasDatabase, clumpiness){

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
            pOrders[j] = pOrders[i];
            pOrders[i] = temp;
        }
        return pOrders;
    };

    /**
     * Determines a relative starting point for the merging array.
     * @param pOrder The Peripheral Order (relative zone) in which the array is to be placed.
     * @param xPad The radius along the width-axis to the edge of the base array from the left side of the glob
     * @param yPad The radius along the height-axis to the edge of the base array from the top side of the glob
     * @param xDim
     * @param yDim
     * @param margin
     * @returns {{x: number, y: number}}
     * @private
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

    Board.__merge = function(array, space){
        if(array.length < 1){return;}
        var glob = array.shift();
        var center = {x: Math.floor(glob[0].length/2), y: Math.floor(glob.length/2)};
        while(array.length){
            var ordering = Board.__getRandomPeripheralOrders();
            while(ordering.length) {
                var next = array.shift();
                var nextDim = {wr: Math.floor(next[0].length/2), hr: Math.floor(next.length/2)};
                var pOrder = ordering.shift();
                var startCoords = Board.__placeCopyPoint(pOrder, center.x, center.y, nextDim.wr, nextDim.hr, space);

            }
        }

    };

    /**
     * Adds a clump and any necessary bridging to connect it to the other clumps.
     * @param clumpToAdd The clump object to add. {array, lock}
     * @param container the container to which the clump and any appropriate paths should be added.
     *
     */
    Board.prototype.addClump = function(clumpToAdd, container){

    };

    return Board;
});
