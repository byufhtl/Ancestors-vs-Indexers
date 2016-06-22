define(['model/IAncestor'],function(IAncestor) {

    function LevelDefinition() {
      this.rowHeight = 600/6;
      this.rowWidth = 1000;
      this.topMargin = 40;
    }

    LevelDefinition.prototype.getLevel = function(levelNum)
    {
      switch(levelNum) {
      case 0:
          return this.level1();
          break;
      case 1:
          return this.level2();
          break;
      case 2:
          return this.level3();
          break;
      default:
          return null;
        }
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

    LevelDefinition.prototype.level1 = function()
    {
      var level = [];

      var wave1 = [];
      var wave1Zombie1 = new IAncestor(0);
      wave1.push(wave1Zombie1);

      var wave1Zombie2 = new IAncestor(1);
      wave1.push(wave1Zombie2);

      var wave1Zombie3 = new IAncestor(2);
      wave1.push(wave1Zombie3);

      var wave1Zombie4 = new IAncestor(4);
      wave1.push(wave1Zombie4);
      level.push(wave1);


      var wave2 = [];
      var wave2Zombie1 = new IAncestor(3);
      wave2.push(wave2Zombie1);
      level.push(wave2);
      this.setXYCoordinates(level);
      return level;
    };

    LevelDefinition.prototype.level2 = function()
    {

    };

    LevelDefinition.prototype.level3 = function()
    {

    };
    return LevelDefinition;
});
