define(['model/IAncestor','ancestors/NamelessAncestor'],function(IAncestor, Nameless) {

    function LevelDefinition() {
      this.rowHeight = 600/6;
      this.rowWidth = 1000;
      this.topMargin = 105;
    }

    LevelDefinition.prototype.getLevel = function(levelNum)
    {
        var levelData = LevelDefinition.parseLevel(levelNum + 1);
        this.setXYCoordinates(levelData);
        return levelData;
    };

    LevelDefinition.prototype.setXYCoordinates = function(level)
    {
      for (var i = 0; i < level.length; i++)
      {
        for (var j = 0; j < level[i].length; j++)
        {
          var y_coord = level[i][j].lane * this.rowHeight + this.topMargin;
          var x_coord = this.rowWidth;
          level[i][j].xCoord = x_coord;
          level[i][j].yCoord = y_coord;
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
