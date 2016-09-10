define([],function() {

    function IAncestor(row, column) {
        this.cellPosition = {xCoord:column,yCoord:row};
        this.pixelPosition = {xCoord:column*150, yCoord:row*150};
        this.currentDirection = null;
        this.nextDirection = null;
        this.distanceTraveled = 0;
        this.speed = 150;
        this.type = "default";

        this.animTimer = 0;
        this.animFrame = 0;
        this.timeBetweenFrames = 1;
    }

    IAncestor.prototype.move = function(timeElapsed, board) {
        var self = this;

        this.distanceTraveled += timeElapsed * this.speed;

        if (this.distanceTraveled >= 150) {
            this.distanceTraveled = 0;

            //choose a random direction
            var canGoRight = (self.cellPosition.xCoord + 1 < board.tileArray[self.cellPosition.yCoord].length && board.tileArray[self.cellPosition.yCoord][self.cellPosition.xCoord + 1] != null);
            var canGoLeft = (self.cellPosition.xCoord - 1 >= 0 && board.tileArray[self.cellPosition.yCoord][self.cellPosition.xCoord - 1] != null);
            var canGoUp = (self.cellPosition.yCoord - 1 >= 0 && board.tileArray[self.cellPosition.yCoord - 1][self.cellPosition.xCoord] != null);
            var canGoDown = (self.cellPosition.yCoord + 1 < board.tileArray.length && board.tileArray[self.cellPosition.yCoord + 1][self.cellPosition.xCoord] != null);

            var newPosChosen = false;

            //keep going straight with percent chance
            if ((Math.floor(Math.random() * 5)) > 1){

                if (this.currentDirection == IAncestor.RIGHT && canGoRight){
                    newPosChosen = true;
                    this.cellPosition.xCoord++;
                }
                else if  (this.currentDirection == IAncestor.LEFT && canGoLeft){
                    newPosChosen = true;
                    this.cellPosition.xCoord--;
                }
                else if  (this.currentDirection == IAncestor.UP && canGoUp ){
                    newPosChosen = true;
                    this.cellPosition.yCoord--;
                }
                else if  (this.currentDirection == IAncestor.DOWN && canGoDown ){
                    newPosChosen = true;
                    this.cellPosition.yCoord++;
                }
            }


            while (!newPosChosen) {
                var random = Math.floor(Math.random() * 5);
                switch (random) {
                    case 1:
                        if (canGoUp) {
                            this.cellPosition.yCoord--;
                            this.currentDirection = IAncestor.UP;
                            newPosChosen = true;
                        }
                        break;
                    case 2:
                        if (canGoDown) {
                            this.cellPosition.yCoord++;
                            this.currentDirection = IAncestor.DOWN;
                            newPosChosen = true;
                        }
                        break;
                    case 3:
                        if (canGoLeft) {
                            this.cellPosition.xCoord--;
                            this.currentDirection = IAncestor.LEFT;
                            newPosChosen = true;
                        }
                        break;
                    case 4:
                        if (canGoRight) {
                            this.cellPosition.xCoord++;
                            this.currentDirection = IAncestor.RIGHT;
                            newPosChosen = true;
                        }
                        break;
                }
            }
        }

        switch (this.currentDirection) {
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

        // Per-tile movement overflow corrections. Called once per overall tile moved.
        if(!self.distanceTraveled){
            var xOver = self.pixelPosition.xCoord % 150;
            var yOver = self.pixelPosition.yCoord % 150;
            if(xOver >= 75){
                self.pixelPosition.xCoord += 150 - xOver;
            }
            else{
                self.pixelPosition.xCoord -= xOver;
            }
            if(yOver >= 75){
                self.pixelPosition.yCoord += 150 - yOver;
            }
            else{
                self.pixelPosition.yCoord -= yOver;
            }
        }
    };

    IAncestor.RIGHT = "right";
    IAncestor.LEFT = "left";
    IAncestor.UP = "up";
    IAncestor.DOWN = "down";

    return IAncestor;

});
