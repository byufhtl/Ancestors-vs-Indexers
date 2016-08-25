define(['game/Tile'],function(Tile) {

    function Board(){}

    /**
     * Generates and returns the 2d array representing all board tiles
     * @param levelData {#ofDatabases, #extraClumps, #Clumpiness}
     */
    Board.generate = function(levelData){
        /*
            For # of clumps
                var clump = makeClump();
                Add it to the field
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

    /**
     * Creates a single clump, represented as a two-dimensional array of Tiles. Spaces with no tiles should be
     * represented by null.
     */
    Board.makeClump = function(){

    };

    /**
     * Builds the links between clumps within the field.
     */
    Board.combineClumps = function(){

    };

    return Board;
});
