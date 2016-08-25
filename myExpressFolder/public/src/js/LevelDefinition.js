define(['model/IAncestor','ancestors/NamelessAncestor', 'ancestors/FamilyMember', 'game/Board'],function(IAncestor, Nameless, FamilyMember, Board) {

    function LevelDefinition(){}

    //returns the 2dimensional structure of the level
    LevelDefinition.generateBoard = function(level){
        var levelData = LevelDefinition.getLevelData(level);
        var board = Board.generate(levelData);
        return board;
    };

    //returns the core elements of board construction based on level
    LevelDefinition.getLevelData = function(level){
        var data = {};
        switch(level){
          case: 1
            data.numDatabase = 1;
            data.numAdditionalClumps = 0;
            data.clumpiness = 3;
        }
    }

    return LevelDefinition;
});
