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
    Board.prototype.makeCycles = function(){

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
