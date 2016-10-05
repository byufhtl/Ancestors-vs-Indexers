define(['util/Sig'],function(Sig) {

    function Player() {
        this.numRecords = 0;
        this.namedRecords = [];
        this.playerCellPosition = {};
        this.playerPixelPosition = {};
        this.currentDirection = null;
        this.distanceTraveled = 0;
        this.speed = 250;
        this.animCorrect = 5;
        this.directionSelected = false;
        this.directionInQueue = null;

        this.animTimer = 0;
        this.animXFrame = 0;
        this.previousAnimXFrame = 1;
        this.animYFrame = 0;
        this.timeBetweenFrames = .2;
        this.numFrames = 2;
    }

    Player.prototype.animate = function(timeElapsed){

        this.animTimer += timeElapsed;
        if (this.animTimer > this.timeBetweenFrames){
            this.animTimer = 0;
            if (this.animXFrame == 0) {

              this.animXFrame = 1;
              this.previousAnimXFrame = 0;
            }
            else if (this.animXFrame == this.numFrames) {
              this.animXFrame = this.numFrames - 1;
              this.previousAnimXFrame = this.numFrames;
            }
            else if (this.animXFrame > 0 && this.animXFrame < this.numFrames){
              if (this.previousAnimXFrame < this.animXFrame){
                  this.animXFrame++;
              }
              else this.animXFrame--;
            }
        }
    };

    Player.prototype.checkGotKey = function(board, update){
        if (this.playerCellPosition.xCoord == board.key.xCoord && this.playerCellPosition.yCoord == board.key.yCoord){
            console.log("we found the KEY!!!!");
            for (var row in board.locked){
                for (var tile in board.locked[row]){
                    board.locked[row][tile].locked = false;
                }
            }
            // update.handle(new Sig(Sig.UPD_RNDR, Sig.SET_BOARD, {}));
        }
    };

    Player.prototype.changeDirection = function(board, nextDirection, x, y) {
      var self = this;
      var successfullyChangedDirections = false;
      switch (nextDirection) {
          case Player.RIGHT:
              if (x + 1 < board.tileArray[y].length && board.tileArray[y][x + 1] != null
              && !board.tileArray[y][x + 1].locked) {
                  successfullyChangedDirections = true;
              }
              break;
          case Player.LEFT:
              if (x - 1 >= 0 && board.tileArray[y][x - 1] != null
              && !board.tileArray[y][x - 1].locked) {
                  successfullyChangedDirections = true;
              }
              break;
          case Player.UP:
              if (y - 1 >= 0 && board.tileArray[y - 1][x] != null
              && !board.tileArray[y - 1][x].locked) {
                  successfullyChangedDirections = true;
              }
              break;
          case Player.DOWN:
              if (y + 1 < board.tileArray.length && board.tileArray[y + 1][x] != null
              && !board.tileArray[y + 1][x].locked) {
                  successfullyChangedDirections = true;
              }
              break;
      }


      return successfullyChangedDirections;
    };


    Player.prototype.setAnim = function(){
      var self = this;
        switch(self.currentDirection){
          case Player.UP:
              self.animYFrame = 3;
              break;
          case Player.DOWN:
              self.animYFrame = 0;
              break;
          case Player.RIGHT:
              self.animYFrame = 2;
              break;
          case Player.LEFT:
              self.animYFrame = 1;
              break;
        }
    };

    Player.prototype.checkTileAction = function(board, update) {
        var tile = board.tileArray[this.playerCellPosition.yCoord][this.playerCellPosition.xCoord];
        if (tile.database){
            if(tile.numRecords) {
                this.numRecords += tile.numRecords;
                tile.numRecords = 0;
            }
            if(tile.ancestorNames.length) {
                for (var i = 0; i < tile.ancestorNames.length; i++) {
                    // console.log("pushing", tile.ancestorNames[i]);
                    this.namedRecords.push(tile.ancestorNames[i]);
                }
                tile.ancestorNames = []; // Get rid of old values.
            }
        }
    };

    Player.prototype.checkAncestorCollision = function(ancestors){
        for (var i = 0; i < ancestors.length; i++){
            if (this.playerCellPosition.xCoord == ancestors[i].cellPosition.xCoord && this.playerCellPosition.yCoord == ancestors[i].cellPosition.yCoord) {
                if (ancestors[i].type == "familyMember"){
                    //check if i've found the name
                    for (var j = 0; j < this.namedRecords.length; j++){
                        if (this.namedRecords[j] == ancestors[i].name){
                            this.namedRecords.splice(j, 1);
                            this.numRecords--;
                            ancestors.splice(i, 1); return;
                        }
                    }
                }
                else{
                    this.numRecords--;
                    ancestors.splice(i, 1); return;
                }
            }
        }
    };

    Player.prototype.updateBoardPosition = function(){
      var self = this;
      switch (this.currentDirection) {
          case Player.RIGHT:
              self.playerCellPosition.xCoord++;
              break;
          case Player.LEFT:
              self.playerCellPosition.xCoord--;
              break;
          case Player.UP:
              self.playerCellPosition.yCoord--;
              break;
          case Player.DOWN:
              self.playerCellPosition.yCoord++;
              break;
      }
    }
    Player.prototype.movePlayer = function(timeElapsed, board, ancestors, update) {
        var self = this;

        this.timeBetweenFrames = 50 / this.speed;

        this.animate(timeElapsed);
        if (this.directionSelected)
            this.distanceTraveled += timeElapsed * self.speed;

        if (this.distanceTraveled >= 150) {
            //update board position
            this.updateBoardPosition();
            this.distanceTraveled = 0;
            this.playerPixelPosition.xCoord = 150* this.playerCellPosition.xCoord;
            this.playerPixelPosition.yCoord = 150* this.playerCellPosition.yCoord;
            this.checkGotKey(board, update);
            this.checkTileAction(board, update);
            if (this.numRecords > 0) this.checkAncestorCollision(ancestors);
            if (board.tileArray[this.playerCellPosition.yCoord][this.playerCellPosition.xCoord].clumpID == 0){
                if (this.speed > 1000) this.speed = 1000;
                else this.speed *= 1.15;
            }
            else {
              if (this.speed < 250) this.speed = 250;
              else this.speed *= .90;
            }
            this.directionSelected = false;
            if (this.directionInQueue != null){
                this.directionSelected = true;
                this.currentDirection = this.directionInQueue;
                this.directionInQueue = null;
            }
        }

        if (this.directionSelected){
            self.setAnim();

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
        }

    };

    Player.RIGHT = "right";
    Player.LEFT = "left";
    Player.UP = "up";
    Player.DOWN = "down";

    return Player;
});
