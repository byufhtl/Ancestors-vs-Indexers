define(['model/IAncestor','ancestors/NamelessAncestor', 'ancestors/FamilyMember', 'game/Board'],function(IAncestor, Nameless, FamilyMember, Board) {

    function LevelDefinition(){}

    //returns the 2dimensional structure of the level
    LevelDefinition.generateBoard = function(level){
        var levelData = LevelDefinition.getLevelData(level);
        var board = new Board();
        board.generate(levelData);
        return board;
    };
    //returns the core elements of board construction based on level
    LevelDefinition.getLevelData = function(level){
        var data = {};
        switch(level){
          case 1:
            data.numDBs = 3;
            data.numExtraClumps = 5;
            data.clumpiness = 12;

            data.numAncestors = 25;

            data.numLocked = 3;

            return data;
        }
    };

    return LevelDefinition;
});
