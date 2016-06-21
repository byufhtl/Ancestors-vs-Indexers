define(['IAncestor.js'],function(IAncestor) {

    function LevelDefinition() {

    }

    LevelDefinition.prototype.getLevel(levelNum)
    {
      switch(levelNum) {
      case 0:
          return level1();
          break;
      case 1:
          return level2();
          break;
      case 2:
          return level3();
          break;
      default:
          return null;
    }

    var level1 = function()
    {
      var level = [];

      var wave1 = [];
      var wave1Zombie1 = new IAncestor(0);
      wave1.push(wave1Zombie1);
      level.push(wave1);

      var wave2 = [];
      var wave2Zombie1 = new IAncestor(0);
      wave1.push(wave2Zombie1);
      level.push(wave2);

      return level;
    };

    var level2 = function()
    {

    };

    var level3 = function()
    {

    };


    return LevelDefinition;

});
