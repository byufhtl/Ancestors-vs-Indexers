define([],function() {


    var Update()
    {

    }

    Update.prototype.updateAncestorsPosition = function(activeAncestors)
    {
      for (var i = 0; i < activeZombies.length; i++)
      {
        activeZombies[i].xCoord -= modifier * activeZombies[i].speed;
        activeZombies[i].xCoord -= modifier * activeZombies[i].speed;
      }
    };


    Update.prototype.update = function(activeAncestors, activeIndexers, timeElapsed)
    {
      this.updateDistance(activeAncestors);
    };


    return Update;

});
