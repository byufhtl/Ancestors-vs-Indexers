define([],function() {

    function IIndexer() {
      this.throwDelay = 4;
      this.throwTimer = 0;
      this.xNode = 0;
      this.yNode = 0;
      this.type = "standard";
      this.dmg = 1;
      this.projectileOrientation = "upRight";
    }

    IIndexer.prototype.getProjectile = function(numGenerations){
        var canShootUpLeft;
        var canShootUpRight;
        var canShootDownLeft;
        var canShootDownRight;

        if (this.projectileOrientation == "upRight")
        {
            this.projectileOrientation = "downRight";
        }
        else
        {
              this.projectileOrientation = "upRight";
        }
        return {
            xCoord : this.xCoord + 5,
            yCoord : this.yCoord + 20,
            type : this.type,
            dmg : this.dmg,
            type: "normal",
            orientation: this.projectileOrientation
        }
    };

    return IIndexer;

});
