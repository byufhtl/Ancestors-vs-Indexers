define([],function(IAncestor, Nameless, FamilyMember, Board) {

    function Player(){
      this.playerCellPosition = {};
      this.playerPixelPosition = {};
      this.currentDirection = Player.UP;
      this.nextDirection = Player.RIGHT;
      this.distanceTraveled = 0;
      this.speed = 30;
    }

    Player.prototype.movePlayer = function(timeElapsed){
        var self = this;

        this.distanceTraveled += timeElapsed * self.speed;

        if (this.distanceTraveled >= 150){
            this.distanceTraveled = 0;
            switch(this.nextDirection){
              case Player.RIGHT:
                this.playerCellPosition.xCoord++;
                break;
              case Player.LEFT:
                this.playerCellPosition.xCoord--;
                break;
              case Player.UP:
                this.playerCellPosition.yCoord++;
                break;
              case Player.Down:
                this.playerCellPosition.yCoord--;
                break;
            }
            this.currentDirection = this.nextDirection;
        }

        switch(this.currentDirection){
          case Player.RIGHT:
            self.playerPixelPosition.xCoord += timeElapsed * self.speed;
            break;
          case Player.LEFT:
            self.playerPixelPosition.xCoord -= timeElapsed * self.speed;
            break;
          case Player.UP:
            self.playerPixelPosition.yCoord += timeElapsed * self.speed;
            break;
          case Player.Down:
            self.playerPixelPosition.yCoord -= timeElapsed * self.speed;
            break;
        }
    };

    Player.RIGHT = "right";
    Player.LEFT = "left";
    Player.UP = "up";
    Player.DOWN = "down";

    return Player;
});
