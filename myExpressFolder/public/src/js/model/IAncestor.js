define([],function() {

    function IAncestor(row, column) {
        this.cellPosition = {xCoord:column,yCoord:row};
        this.pixelPosition = {xCoord:column*150, yCoord:row*150};
        this.currentDirection = null;
        this.nextDirection = null;
        this.distanceTraveled = 0;
        this.speed = 250;
        this.type = "default";

        this.animTimer = 0;
        this.animFrame = 0;
        this.timeBetweenFrames = 1;
    }

    IAncestor.prototype.move = function(timeElapsed, board){
        var self = this;

        this.distanceTraveled += timeElapsed * this.speed;

        if (this.distanceTraveled >= 150){
            this.distanceTraveled = 0;

            //choose a random direction
            var canGoRight = (self.cellPosition.xCoord + 1 < board.tileArray[self.cellPosition.yCoord].length && board.tileArray[self.cellPosition.yCoord][self.cellPosition.xCoord + 1] != null);
            var canGoLeft = (self.cellPosition.xCoord - 1 >= 0 && board.tileArray[self.cellPosition.yCoord][self.cellPosition.xCoord - 1] != null);
            var canGoUp = (self.cellPosition.yCoord - 1 >= 0 && board.tileArray[self.cellPosition.yCoord - 1][self.cellPosition.xCoord] != null);
            var canGoDown = (self.cellPosition.yCoord + 1 < board.tileArray.length && board.tileArray[self.cellPosition.yCoord + 1][self.cellPosition.xCoord] != null);

            var newPosChosen = false;
            while (!newPosChosen){
              var random = Math.floor(Math.random()*5);
              switch (random) {
                case 1:
                  if (canGoUp){
                    this.cellPosition.yCoord--;
                    this.currentDirection = IAncestor.UP;
                    newPosChosen = true;
                  }
                  break;
                case 2:
                  if (canGoDown){
                    this.cellPosition.yCoord++;
                    this.currentDirection = IAncestor.DOWN;
                    newPosChosen = true;
                  }
                  break;
                case 3:
                  if (canGoLeft){
                    this.cellPosition.xCoord--;
                    this.currentDirection = IAncestor.LEFT;
                    newPosChosen = true;
                  }
                  break;
                case 4:
                  if (canGoRight){
                    this.cellPosition.xCoord++;
                    this.currentDirection = IAncestor.RIGHT;
                    newPosChosen = true;
                  }
                  break;

              }
            }




        }

        switch(this.currentDirection){
          case IAncestor.RIGHT:
            self.pixelPosition.xCoord += timeElapsed * self.speed;
            break;
          case IAncestor.LEFT:
            self.pixelPosition.xCoord -= timeElapsed * self.speed;
            break;
          case IAncestor.UP:
            self.pixelPosition.yCoord -= timeElapsed * self.speed;
            break;
          case IAncestor.DOWN:
            self.pixelPosition.yCoord += timeElapsed * self.speed;
            break;
        }
    }

    IAncestor.RIGHT = "right";
    IAncestor.LEFT = "left";
    IAncestor.UP = "up";
    IAncestor.DOWN = "down";

    return IAncestor;

});
