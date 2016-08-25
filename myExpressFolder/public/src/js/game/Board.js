define(['game/Tile'],function(Tile) {


    function Board(){
        this.tileArray = [];
    }


    /**
     * Generates and returns the 2d array representing all board tiles
     * @param levelData {#ofDatabases, #extraClumps, #Clumpiness}
     */
    Board.generate = function(levelData){

        for(var dbi = 0; dbi < levelData.numDBs; dbi++){
            /*
             * Make a clump with a DB in it
             * Add it to the field.
             */
        }
        for(var clumpi = 0; clumpi < levelData.numExtraClumps; clumpi++){
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
    Board.makeCycles = function(){

    };

    /**
     * Combines cycles within a clump.
     */
    Board.combineCycles = function(){

    };

    /*
     * @param hasDatabase whether or not the clump should contain a database.
     */
    Board.makeClump = function(hasDatabase){

    };

    /**
     * Builds the links between clumps within the field.
     */
    Board.combineClumps = function(){

    };

    return Board;
});
