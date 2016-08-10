define([],function() {

    function IAncestor() {
        this.hp = 1;
        this.speed = 30;
        this.currentGeneration = 3;
        this.animation;
        this.xCoord = 1000;
        this.yCoord = 300;
        this.nodeX = null;
        this.nodeY = null;
        this.distanceMovedX = 300;
        this.upOrDown = "up";
        this.type = "standard";

        this.animTimer = 0;
        this.animFrame = 0;
        this.numFrames = 4;
        this.timeBetweenFrames = .2;

        this.slowed = 15;
        this.slowDuration = 0;
    }

    IAncestor.prototype.setX = function(x, nodex){
        this.xCoord = x;
        this.nodeX = nodex;
    };

    IAncestor.prototype.setY = function (y, nodey) {
        this.yCoord = y;
        this.nodeY = nodey;
    };
    
    IAncestor.prototype.move = function(timeElapsed, nodeStructure){
      var self = this;
      this.slowDuration -= timeElapsed;
      if (this.slowDuration <= 0) this.slowDuration = 0;
      if (this.slowDuration == 0) this.slowed = 0;
      else this.slowed = 15;
      //check whether to move up or down
      if (self.distanceMovedX >= 300)
      {
          var numNodes = self.currentGeneration + 1;
          var firstNodeY = - self.currentGeneration * 150 + 300;
          //check if moving up is impossible
          
          if (Math.abs(firstNodeY - self.yCoord) < 150)
          {
               self.upOrDown = "up";
          }
          //check if moving down is impossible
          else if (((firstNodeY + (numNodes - 1) * 300) - self.yCoord) < 150)
          {
                self.upOrDown = "down";
          }
          else
          {
              var random = Math.random();
              if (random > 0.5)
              {
                  self.upOrDown = "up";
              }
              else
              {
                  self.upOrDown = "down";
              }
          }
          self.distanceMovedX = 0;
          self.currentGeneration--;
      }
      //move ancestor diagonally according to speed
      console.log("myCurrentSpeed:", (self.speed - self.slowed));
      self.distanceMovedX += timeElapsed * (self.speed -self.slowed);
      self.xCoord -= timeElapsed * (self.speed -self.slowed);
      if (self.upOrDown == "up")
      {
          self.yCoord += timeElapsed * (self.speed -self.slowed) / 2;
      }
      else if (self.upOrDown == "down")
      {
          self.yCoord -= timeElapsed * (self.speed -self.slowed) / 2;
      }
    };

    return IAncestor;

});
