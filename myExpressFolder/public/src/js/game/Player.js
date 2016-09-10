define(['util/Sig'],function(Sig) {

    function Player() {
        this.numRecords = 0;
        this.namedRecords = [];
        this.playerCellPosition = {};
        this.playerPixelPosition = {};
        this.currentDirection = null;
        this.nextDirection = null;
        this.distanceTraveled = 0;
        this.speed = 250;
        this.animCorrect = 5;
    }

    Player.prototype.checkGotKey = function(board, update){
        if (this.playerCellPosition.xCoord == board.key.xCoord && this.playerCellPosition.yCoord == board.key.yCoord){
            console.log("we found the KEY!!!!");
            for (var row in board.locked){
                for (var tile in board.locked[row]){
                    board.locked[row][tile].locked = false;
                }
            }
            update.handle(new Sig(Sig.UPD_RNDR, Sig.SET_BOARD, {}));
        }
    };

    Player.prototype.changeDirection = function(board) {
      var self = this;
      var successfullyChangedDirections = false;
      switch (this.nextDirection) {
          case Player.RIGHT:
              if (self.playerCellPosition.xCoord + 1 < board.tileArray[self.playerCellPosition.yCoord].length && board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord + 1] != null
              && !board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord + 1].locked) {
                  this.playerCellPosition.xCoord++;
                  this.currentDirection = this.nextDirection;
                  successfullyChangedDirections = true;
              }
              break;
          case Player.LEFT:
              if (self.playerCellPosition.xCoord - 1 >= 0 && board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord - 1] != null
              && !board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord - 1].locked) {
                  this.playerCellPosition.xCoord--;
                  this.currentDirection = this.nextDirection;
                  successfullyChangedDirections = true;
              }
              break;
          case Player.UP:
              if (self.playerCellPosition.yCoord - 1 >= 0 && board.tileArray[self.playerCellPosition.yCoord - 1][self.playerCellPosition.xCoord] != null
              && !board.tileArray[self.playerCellPosition.yCoord - 1][self.playerCellPosition.xCoord].locked) {
                  this.playerCellPosition.yCoord--;
                  this.currentDirection = this.nextDirection;
                  successfullyChangedDirections = true;
              }
              break;
          case Player.DOWN:
              if (self.playerCellPosition.yCoord + 1 < board.tileArray.length && board.tileArray[self.playerCellPosition.yCoord + 1][self.playerCellPosition.xCoord] != null
              && !board.tileArray[self.playerCellPosition.yCoord + 1][self.playerCellPosition.xCoord].locked) {
                  self.playerCellPosition.yCoord++;
                  self.currentDirection = self.nextDirection;
                  successfullyChangedDirections = true;
              }
              break;
      }

      if (!successfullyChangedDirections) {
          if (self.nextDirection == Player.UP || self.nextDirection == Player.DOWN) {
              if (self.playerCellPosition.xCoord + 1 < board.tileArray[self.playerCellPosition.yCoord].length && board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord + 1] != null
              && !board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord + 1].locked) {
                  this.playerCellPosition.xCoord++;
                  this.currentDirection = Player.RIGHT;
                  this.nextDirection = Player.RIGHT;
              }
              else if (self.playerCellPosition.xCoord - 1 >= 0 && board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord - 1] != null
              && !board.tileArray[self.playerCellPosition.yCoord][self.playerCellPosition.xCoord - 1].locked) {
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
              if (self.playerCellPosition.yCoord - 1 >= 0 && board.tileArray[self.playerCellPosition.yCoord - 1][self.playerCellPosition.xCoord] != null
              && !board.tileArray[self.playerCellPosition.yCoord - 1][self.playerCellPosition.xCoord].locked) {
                  this.playerCellPosition.yCoord--;
                  this.currentDirection = Player.UP;
                  this.nextDirection = Player.UP;
              }
              else if (self.playerCellPosition.yCoord + 1 < board.tileArray.length && board.tileArray[self.playerCellPosition.yCoord + 1][self.playerCellPosition.xCoord] != null
              && !board.tileArray[self.playerCellPosition.yCoord + 1][self.playerCellPosition.xCoord].locked) {
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
    };

    Player.prototype.checkTileAction = function(board, update) {
        var tile = board.tileArray[this.playerCellPosition.yCoord][this.playerCellPosition.xCoord];
        if (tile.database){
            this.numRecords += tile.numRecords;
            tile.numRecords = 0;
            for (var i = 0; i < tile.ancestorNames.length; i++){
                console.log("pushing", tile.ancestorNames[i]);
                this.namedRecords.push(tile.ancestorNames[i]);
            }
            update.handle(new Sig(Sig.UPD_RNDR, Sig.SET_BOARD, {}));
        }
    };

    Player.prototype.checkAncestorCollision = function(ancestors){
        for (var i = 0; i < ancestors.length; i++){
            if (this.playerCellPosition.xCoord == ancestors[i].cellPosition.xCoord && this.playerCellPosition.yCoord == ancestors[i].cellPosition.yCoord) {
                console.log("collision occured");
                if (ancestors[i].type == "familyMember"){
                    //check if i've found the name
                }
                else{

                    ancestors.splice(i, 1); return;
                }
            }
        }
    }

    Player.prototype.movePlayer = function(timeElapsed, board, ancestors, update) {
        var self = this;
        // console.log("player x: " + this.playerCellPosition.xCoord + " y: " + this.playerCellPosition.yCoord);
        // console.log("board height: " + board.tileArray.length + " board width" + board.tileArray[0].length);

        this.distanceTraveled += timeElapsed * self.speed;

        if (this.distanceTraveled >= 150) {
            this.distanceTraveled = 0;
            this.changeDirection(board);
            this.checkGotKey(board, update);
            this.checkTileAction(board, update);
            if (this.numRecords > 0) this.checkAncestorCollision(ancestors)
            if (board.tileArray[this.playerCellPosition.yCoord][this.playerCellPosition.xCoord].clumpID == 0){
                if (this.speed > 1000) this.speed = 1000;
                else this.speed *= 1.15;
            }
            else {
              if (this.speed < 250) this.speed = 250;
              else this.speed *= .90;
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
        if(!self.distanceTraveled && !(this.animCorrect--)){
            this.animCorrect = 5;
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
