define(['model/IAncestor','ancestors/NamelessAncestor', 'ancestors/FamilyMember', 'game/board/Board'],function(IAncestor, Nameless, FamilyMember, Board) {

    function LevelDefinition(){}

    //returns the 2dimensional structure of the level
    LevelDefinition.generateBoard = function(level){
        var levelData = LevelDefinition.getLevelData(level);
        var board = new Board();
        board.generate(levelData);
        return board;
    };
    //returns the core elements of board construction based on level
    LevelDefinition.getLevelData = function(act, scene){
        var data = {};
        switch(act){
          case 1:
            data.numDBs = 3;
            data.numExtraClumps = 0;
            data.clumpiness = 5;
            data.numAncestors = 21;
            data.numLocked = 0;
            return data;
        }
    };

    LevelDefinition.addFamilyMember = function(lvl, scene, eightGenerations, board, i)
    {
        var availableAtGen = [];

        for (var i = 0; i < eightGenerations.length; i++)
        {
            if (eightGenerations[i].data.display.ascendancyNumber >= (Math.pow(2, lvl)) &&
                eightGenerations[i].data.display.ascendancyNumber < (Math.pow(2,lvl + 1)))
                {
                    availableAtGen.push(eightGenerations[i]);
                }
        }
        if (availableAtGen.length == 0)
        {
            return new FamilyMember(board.ancestorStartingPositions[i].row, board.ancestorStartingPositions[i].col);
        }
        var length = availableAtGen.length;
        var random = Math.floor(Math.random() * length);
        var personInfo = availableAtGen[random];

        var familyMember = new FamilyMember(board.ancestorStartingPositions[i].row, board.ancestorStartingPositions[i].col);
        familyMember.name = personInfo.data.display.name;
        familyMember.data = personInfo;
        return familyMember;
    };

    LevelDefinition.setRealAncestors = function(activeAncestors, eightGenerations, board, act, scene) {
        var numToAdd = act;
        for (var i = 0; i < board.databaseTiles.length; i++){
            board.databaseTiles[i].ancestorNames = [];
        }
        for (var i = 0; i < board.ancestorStartingPositions.length; i++){
            if (numToAdd > 0){
                console.log("adding family member");
                activeAncestors.push(LevelDefinition.addFamilyMember(act, scene, eightGenerations, board, i));
                board.databaseTiles[Math.floor(Math.random() * board.databaseTiles.length)].ancestorNames.push(activeAncestors[activeAncestors.length - 1].name);
                numToAdd--;
            }
            else{
                activeAncestors.push(new IAncestor(board.ancestorStartingPositions[i].row, board.ancestorStartingPositions[i].col));
            }
        }
    };

    return LevelDefinition;
});
