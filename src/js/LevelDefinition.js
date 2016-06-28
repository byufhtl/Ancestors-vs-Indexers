define(['model/IAncestor','ancestors/NamelessAncestor'],function(IAncestor, Nameless) {

    function LevelDefinition() {
      this.rowHeight = 600/6;
      this.rowWidth = 900;
      this.topMargin = 105;
    }

    LevelDefinition.prototype.getLevel = function(levelNum)
    {
        var levelData = LevelDefinition.parseLevel(levelNum + 1);
        this.setXYCoordinates(levelData, levelNum);
        return levelData;
    };

    LevelDefinition.prototype.getLevelStructure = function(levelNum)
    {
        var levelStructure = [];
        var offset = 150;
        levelNum++;
        for (var i = 0; i < levelNum; i++)
        {
            var trianglesForGeneration = [];
            var numTriangles = i * 2 + 1;
            var type = "alpha";
            var xCoord = i * 300;
            var yCoord = - i * 150 + offset;
            for (var j = 0; j < numTriangles; j++)
            {
                var tempTriangle = {};
                tempTriangle.xCoord = xCoord;
                tempTriangle.yCoord = yCoord;
                tempTriangle.type = type;
                trianglesForGeneration.push(tempTriangle);
                yCoord += 150;
                if (type == "alpha")
                {
                  type = "beta";
                }
                else
                {
                  type = "alpha";
                }
            }
            levelStructure.push(trianglesForGeneration);
        }

        return levelStructure;
    };

    LevelDefinition.prototype.getNodeStructure = function(levelNum)
    {
        var nodeStructure = [];
        var offset = 300;
        levelNum++;
        for (var i = 0; i < levelNum + 1; i++)
        {
            var type = "alpha";
            var nodesForGeneration = [];
            var numNodes = i * 2 + 1;
            var xCoord = i * 300;
            var yCoord = - i * 150 + offset;
            for (var j = 0; j < numNodes; j++)
            {
                if (type == "alpha")
                {
                    var tempNode = {};
                    tempNode.xCoord = xCoord;
                    tempNode.yCoord = yCoord;
                    tempNode.occupied = false;
                    nodesForGeneration.push(tempNode);
                }
                yCoord += 150;
                if (type == "alpha")
                {
                  type = "beta";
                }
                else
                {
                  type = "alpha";
                }
            }
            nodeStructure.push(nodesForGeneration);
        }
        return nodeStructure;
    };

    LevelDefinition.prototype.setXYCoordinates = function(levelData, levelNum)
    {
      var numNodes = levelNum + 1;
      var firstNodeYCoord = - numNodes * 150 + 300;
      for (var i = 0; i < levelData.length; i++)
      {
        for (var j = 0; j < levelData[i].length; j++)
        {
          var random = Math.floor(Math.random() * numNodes);
          var y_coord =  firstNodeYCoord + random * 300;
          var x_coord = (levelNum + 1)* 300;
          levelData[i][j].xCoord = x_coord;
          levelData[i][j].yCoord = y_coord;
          levelData[i][j].currentGeneration = levelNum + 1;
        }
      }
    };

    LevelDefinition.parseLevel = function(lvl){
        var level = [];

        var level_scheme = LevelDefinition.levels[lvl];
        if(level_scheme){
            for(var i in level_scheme){
                var wave_scheme = level_scheme[i];
                var wave = [];
                for(var j in wave_scheme){
                    switch(wave_scheme[j]){
                        case 'a':
                            wave.push(new IAncestor(j));
                            break;
                        case 'n':
                            wave.push(new Nameless(j));
                            break;
                        default:
                    }
                }
                level.push(wave);
            }
            return level;
        }
        return null;
    };

    LevelDefinition.levels = {
        1: [
            ['a', 'a', 'a', null, 'a'],
            [null, null, null, 'a', null]
        ],
        2: [
            ['a', 'a', 'a', 'a', 'a'],
            ['a', null, null, 'a', 'a'],
            ['a', 'a', null, null, null]
        ],
        3: [
            ['a', null, 'a', 'a', null],
            ['a', 'a', 'n', 'a', 'a'],
            ['a', 'a', 'a', null, 'a'],
            ['a', 'a', null, 'a', 'n']
        ],
        4: [
            ['a', null, 'a', 'a', null],
            ['a', 'a', 'a', 'a', 'a'],
            ['a', 'a', 'n', null, 'a'],
            ['a', 'a', null, 'a', 'a'],
            ['a', null, 'a', 'a', null],
            ['a', 'n', 'a', 'a', 'a'],
            ['a', 'a', null, 'n', 'a'],
            [null, 'a', 'a', 'a', 'a'],
            ['a', 'a', 'a', 'a', 'a'],
            ['n', 'a', 'a', null, 'a'],
            ['a', null, 'a', 'a', null],
            ['a', 'a', 'a', 'a', 'a'],
            ['a', 'a', 'a', null, 'n'],
            ['a', 'a', null, 'a', 'a']
        ],
        5: [
            ['a', null, 'a', 'a', null],
            [null, null, null, null, null],
            ['a', 'a', 'a', 'a', 'a'],
            [null, null, null, null, null],
            ['a', 'a', 'a', null, 'a'],
            ['a', 'a', null, 'a', 'a'],
            ['a', null, 'a', 'a', null],
            [null, null, null, null, null],
            ['a', 'a', 'a', null, 'a'],
            ['a', 'a', null, 'a', 'a'],
            ['a', null, 'a', 'a', null],
            ['a', 'a', 'a', 'a', 'a'],
            ['a', 'n', null, 'n', 'a'],
            [null, 'a', 'n', 'a', 'a'],
            ['a', 'a', 'a', 'a', 'a'],
            ['a', 'a', 'a', null, 'a'],
            ['n', null, 'a', 'a', 'n'],
            ['a', 'a', 'a', 'a', 'a'],
            ['a', 'a', 'n', null, 'a'],
            ['a', 'a', null, 'a', 'a'],
            ['n', 'n', null, 'n', 'n'],
            ['n', 'a', 'n', 'a', 'n'],
            ['a', 'n', 'a', 'n', 'a'],
            ['n', 'n', 'n', 'n', 'n'],
            ['n', 'n', 'n', 'n', 'n'],
            ['n', 'n', 'n', 'n', 'n']
        ]
    };
    return LevelDefinition;
});
