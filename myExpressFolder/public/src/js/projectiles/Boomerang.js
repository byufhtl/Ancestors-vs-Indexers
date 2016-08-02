define([],function() {

    function Boomerang() {
        this.xCoord = 0;
        this.yCoord = 0;
        this.dmg = 0;
        this.type = "boomerang";
        this.orientation = "downRight";
        this.projectileSpeed = 120;
        this.distanceTraveled = 0;

        this.pythag = 1.118;
    }

    Projectile.prototype.move = function(timeElapsed){
      this.projectileSpeed -= timeElapsed * 24;
      this.distanceTraveled += Math.abs(this.projectileSpeed);
      var self = this;
      if (self.orientation == "upRight") {
          self.xCoord += timeElapsed * this.projectileSpeed / pythag;
          self.yCoord -= timeElapsed * this.projectileSpeed / 2 / pythag;
      }
      else if (self.orientation == "downRight") {
          self.xCoord += timeElapsed * this.projectileSpeed / pythag;
          self.yCoord += timeElapsed * this.projectileSpeed / 2 / pythag;
      }
      else if (self.orientation == "upLeft") {
          self.xCoord -= timeElapsed * this.projectileSpeed / pythag;
          self.yCoord -= timeElapsed * this.projectileSpeed / 2 / pythag;
      }
      else if (self.orientation == "downLeft") {
          self.xCoord -= timeElapsed * this.projectileSpeed / pythag;
          self.yCoord += timeElapsed * this.projectileSpeed / 2 / pythag;
      }
    }

    Projectile.prototype.deleteThis = function(){
        if (this.distanceTraveled >= 300) return true;
        else return false;
    }

    return Projectile;

});
