define(['model/IAncestor'],function() {


    function Update()
    {
      this.wave = 0;
      this.timer = 0;
      this.secondsBetweenWaves = 5;
    }

    Update.prototype.checkAncestorSpawnTimes = function(level, activeAncestors, timeElapsed)
    {
      this.timer += timeElapsed;
      if (this.timer > this.secondsBetweenWaves)
      {
        this.wave++;
      }
      if (level[this.wave] != null)
      {
        for (var i = 0; i < level[this.wave].length; i++)
        {
          activeAncestors.push(level[this.wave][i]);
        }
        level[this.wave] = [];
      }
    };

    Update.prototype.updateAncestorsPosition = function(activeAncestors, modifier)
    {
      for (var i = 0; i < activeAncestors.length; i++)
      {
        activeAncestors[i].xCoord -= modifier * activeAncestors[i].speed;

      }
    };


    Update.prototype.update = function(activeAncestors, activeIndexers, timeElapsed, level)
    {
      this.updateAncestorsPosition(activeAncestors, timeElapsed);
      this.checkAncestorSpawnTimes(level, activeAncestors, timeElapsed);
    };


    return Update;

});
