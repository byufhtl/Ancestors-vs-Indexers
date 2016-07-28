define([],function() {

    function Projectile() {
        this.xCoord = 0;
        this.yCoord = 0;
        this.dmg = 0;
        this.type = "normal";
        this.orientation = "downRight";
        this.projectileSpeed = 80;
    }

    Projectile.prototype.move = function(timeElapsed){
      var self = this;
      if (self.orientation == "upRight") {
          self.xCoord += timeElapsed * this.projectileSpeed;
          self.yCoord -= timeElapsed * this.projectileSpeed / 2;
      }
      else if (self.orientation == "downRight") {
          self.xCoord += timeElapsed * this.projectileSpeed;
          self.yCoord += timeElapsed * this.projectileSpeed / 2;
      }
      else if (self.orientation == "upLeft") {
          self.xCoord -= timeElapsed * this.projectileSpeed;
          self.yCoord -= timeElapsed * this.projectileSpeed / 2;
      }
      else if (self.orientation == "downLeft") {
          self.xCoord -= timeElapsed * this.projectileSpeed;
          self.yCoord += timeElapsed * this.projectileSpeed / 2;
      }
    }

    return Projectile;

});
