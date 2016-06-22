define(['IAncestor'],function(IAncestor) {

    function LevelDefinition() {

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

    LevelDefinition.prototype.level1 = function()
    {
      var level = [];

      var wave1 = [];
      var wave1Zombie1 = new IAncestor(0);
      wave1.push(wave1Zombie1);
      level.push(wave1);

      var wave2 = [];
      var wave2Zombie1 = new IAncestor(0);
      wave2.push(wave2Zombie1);
      level.push(wave2);

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
