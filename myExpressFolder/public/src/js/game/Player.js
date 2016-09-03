define([],function() {

    function Player(){
      this.playerCellPosition = {};
      this.playerPixelPosition = {};
      this.currentDirection = null;
      this.nextDirection = null;
      this.distanceTraveled = 0;
      this.speed = 250;
    }

    Player.prototype.movePlayer = function(timeElapsed, board) {
        var self = this;

        // console.log("player x: " + this.playerCellPosition.xCoord + " y: " + this.playerCellPosition.yCoord);
        // console.log("board height: " + board.tileArray.length + " board width" + board.tileArray[0].length);

        this.distanceTraveled += timeElapsed * self.speed;

        if (this.distanceTraveled >= 150) {
            this.distanceTraveled = 0;
            var successfullyChangedDirections = false;
            switch (this.nextDirection) {
                case Player.RIGHT:

                    if (self.playerCellPosition.xCoord + 1 < board.tileArray[self.playerCellPosition.yCoord].length && board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord + 1] != null) {
                        this.playerCellPosition.xCoord++;
                        this.currentDirection = this.nextDirection;
                        successfullyChangedDirections = true;
                    }
                    break;
                case Player.LEFT:
                    if (self.playerCellPosition.xCoord - 1 >= 0 && board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord - 1] != null) {
                        this.playerCellPosition.xCoord--;
                        this.currentDirection = this.nextDirection;
                        successfullyChangedDirections = true;
                    }
                    break;
                case Player.UP:
                    if (self.playerCellPosition.yCoord - 1 >= 0 && board.tileArray[self.playerCellPosition.yCoord - 1][self.playerCellPosition.xCoord] != null) {
                        this.playerCellPosition.yCoord--;
                        this.currentDirection = this.nextDirection;
                        successfullyChangedDirections = true;
                    }
                    break;
                case Player.DOWN:
                    if (self.playerCellPosition.yCoord + 1 < board.tileArray.length && board.tileArray[self.playerCellPosition.yCoord + 1][self.playerCellPosition.xCoord] != null) {
                        self.playerCellPosition.yCoord++;
                        self.currentDirection = self.nextDirection;
                        successfullyChangedDirections = true;
                    }
                    break;
            }

            if (!successfullyChangedDirections) {
                if (self.nextDirection == Player.UP || self.nextDirection == Player.DOWN) {
                    if (self.playerCellPosition.xCoord + 1 < board.tileArray[self.playerCellPosition.yCoord].length && board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord + 1] != null) {
                        this.playerCellPosition.xCoord++;
                        this.currentDirection = Player.RIGHT;
                        this.nextDirection = Player.RIGHT;
                    }
                    else if (self.playerCellPosition.xCoord - 1 >= 0 && board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord - 1] != null) {
                        this.playerCellPosition.xCoord--;
                        this.currentDirection = Player.LEFT;
                        this.nextDirection = Player.LEFT;
                    }
                    else {
                        if (this.currentDirection == Player.UP) {
                            this.playerCellPosition.yCoord--;
                            this.currentDirection = Player.UP;
                            this.nextDirection = Player.UP;
                        }
                        else {
                            this.playerCellPosition.yCoord++;
                            this.currentDirection = Player.DOWN;
                            this.nextDirection = Player.DOWN;
                        }
                    }
                }
                else if (this.nextDirection == Player.RIGHT || this.nextDirection == Player.LEFT) {
                    if (self.playerCellPosition.yCoord - 1 >= 0 && board.tileArray[self.playerCellPosition.yCoord - 1][self.playerCellPosition.xCoord] != null) {
                        this.playerCellPosition.yCoord--;
                        this.currentDirection = Player.UP;
                        this.nextDirection = Player.UP;
                    }
                    else if (self.playerCellPosition.yCoord + 1 < board.tileArray.length && board.tileArray[self.playerCellPosition.yCoord + 1][self.playerCellPosition.xCoord] != null) {
                        this.playerCellPosition.yCoord++;
                        this.currentDirection = Player.DOWN;
                        this.nextDirection = Player.DOWN;
                    }
                    else {
                        if (this.currentDirection == Player.RIGHT) {
                            this.playerCellPosition.xCoord--;
                            this.currentDirection = Player.LEFT;
                            this.nextDirection = Player.LEFT;
                        }
                        else {
                            this.playerCellPosition.yCoord++;
                            this.currentDirection = Player.RIGHT;
                            this.nextDirection = Player.RIGHT;
                        }
                    }
                }
            }
        } //end change directions


        switch (this.currentDirection) {
            case Player.RIGHT:
                self.playerPixelPosition.xCoord += timeElapsed * self.speed;
                break;
            case Player.LEFT:
                self.playerPixelPosition.xCoord -= timeElapsed * self.speed;
                break;
            case Player.UP:
                self.playerPixelPosition.yCoord -= timeElapsed * self.speed;
                break;
            case Player.DOWN:
                self.playerPixelPosition.yCoord += timeElapsed * self.speed;
                break;
        }

        // Per-tile movement overflow corrections. Called once per overall tile moved.
        if(!self.distanceTraveled){
            var xOver = self.playerPixelPosition.xCoord % 150;
            var yOver = self.playerPixelPosition.yCoord % 150;
            if(xOver >= 75){
                self.playerPixelPosition.xCoord += 150 - xOver;
            }
            else{
                self.playerPixelPosition.xCoord -= xOver;
            }
            if(yOver >= 75){
                self.playerPixelPosition.yCoord += 150 - yOver;
            }
            else{
                self.playerPixelPosition.yCoord -= yOver;
            }
        }
    };

    Player.RIGHT = "right";
    Player.LEFT = "left";
    Player.UP = "up";
    Player.DOWN = "down";

    return Player;
});
