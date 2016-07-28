define([],function() {

    function IAncestor(lane) {
        this.hp = 1;
        this.speed = 30;
        this.currentGeneration = 3;
        this.animation;
        this.xCoord = 1000;
        this.yCoord = 300;
        this.distanceMovedX = 300;
        this.upOrDown = "up";
        this.type = "standard";

        this.animTimer = 0;
        this.animFrame = 0;
        this.numFrames = 4;
        this.timeBetweenFrames = .2;
    }

    IAncestor.prototype.move = function(timeElapsed){
      var self = this;
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
      self.distanceMovedX += timeElapsed * self.speed;
      self.xCoord -= timeElapsed * self.speed;
      if (self.upOrDown == "up")
      {
          self.yCoord += timeElapsed * self.speed / 2;
      }
      else if (self.upOrDown == "down")
      {
          self.yCoord -= timeElapsed * self.speed / 2;
      }
    }

    return IAncestor;

});
