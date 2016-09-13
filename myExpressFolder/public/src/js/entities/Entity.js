/**
 * Created by calvinm2 on 9/12/16.
 */

define([], function(){

    function Entity(row, column){
        this.cellPosition = {xCoord: column, yCoord: row};
        this.pixelPosition = {xCoord: column*150, yCoord: row*150};
        this.currDir = null;
        this.prevDir = null;
        this.distanceTraveled = 0;
        this.speed = 150;
        this.path = [];

        this.currImage = null;
        this.animation = null;
    }

    Entity.UP = "up";
    Entity.DOWN = "down";
    Entity.LEFT = "left";
    Entity.RIGHT = "right";

    Entity.prototype = {
        /**
         * Provides default movement utility for things that move.
         * @param timeElapsed The amount of time elapsed since it's last update.
         * @param board The board the entity is walking on.
         */
        move: function(timeElapsed, board){
            var self = this;
            this.distanceTraveled += timeElapsed * this.speed;
            if(this.distanceTraveled >= 150){
                this.distanceTraveled = 0;
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
                // if(!this.path.length){
                while(!this.path.length){
                    console.log("<<Entity>> Seeking path...");
                    this.path = this.newPath(board);
                    console.log("<<Entity>> New path:", this.path);
                }
                this.prevDir = this.currDir;
                this.currDir = this.calculateDirToNext(this.path.shift());
                console.log("<<Entity>> Now moving", this.currDir, "to", this.cellPosition);
            }

            if(this.currDir){
                switch(this.currDir){
                    case Entity.RIGHT:
                        self.pixelPosition.xCoord += timeElapsed * self.speed;
                        break;
                    case Entity.LEFT:
                        self.pixelPosition.xCoord -= timeElapsed * self.speed;
                        break;
                    case Entity.UP:
                        self.pixelPosition.yCoord -= timeElapsed * self.speed;
                        break;
                    case Entity.DOWN:
                        self.pixelPosition.yCoord += timeElapsed * self.speed;
                        break;
                }
            }
        },
        /**
         * A built-in function for path building that does not require any particular pathfinder.
         * @param board The board to compare against while path planning.
         */
        newPath: function(board){
            var self = this;
            var prefDir;
            var curr = self.cellPosition;
            var path = [];
            for(var k = 0; k < Math.floor(Math.random() * 20); k++){
                //choose a random direction
                switch(Math.floor(Math.random() * 4)){
                    case 0: prefDir = Entity.UP; break;
                    case 1: prefDir = Entity.DOWN; break;
                    case 2: prefDir = Entity.LEFT; break;
                    case 3: prefDir = Entity.RIGHT; break;
                }
                var canGoRight = (curr.xCoord + 1 < board.tileArray[curr.yCoord].length && board.tileArray[curr.yCoord][curr.xCoord + 1] != null);
                var canGoLeft = (curr.xCoord - 1 >= 0 && board.tileArray[curr.yCoord][curr.xCoord - 1] != null);
                var canGoUp = (curr.yCoord - 1 >= 0 && board.tileArray[curr.yCoord - 1][curr.xCoord] != null);
                var canGoDown = (curr.yCoord + 1 < board.tileArray.length && board.tileArray[curr.yCoord + 1][curr.xCoord] != null);

                if  (prefDir == Entity.UP && canGoUp ){
                    --curr.yCoord;
                    path.push({x:self.cellPosition.xCoord, y:self.cellPosition.yCoord});
                }
                else if  (prefDir == Entity.DOWN && canGoDown ){
                    ++curr.yCoord;
                    path.push({x:self.cellPosition.xCoord, y:self.cellPosition.yCoord});
                }
                else if  (prefDir == Entity.LEFT && canGoLeft){
                    --curr.xCoord;
                    path.push({x:self.cellPosition.xCoord, y:self.cellPosition.yCoord});
                }
                else if (prefDir == Entity.RIGHT && canGoRight){
                    ++curr.xCoord;
                    path.push({x:self.cellPosition.xCoord, y:self.cellPosition.yCoord});
                }
            }
            return path;
        },
        /**
         * Calculates the direction to reach the next node in the path.
         * @param next The next coordinate pair to seek out.
         * @returns {*} The string representation of the direction, a member of Entity.
         */
        calculateDirToNext: function(next){
            if(next.y < this.cellPosition.yCoord){
                this.cellPosition.yCoord--;
                return Entity.UP;
            }
            else if(next.y > this.cellPosition.yCoord){
                this.cellPosition.yCoord++;
                return Entity.DOWN;
            }
            else if(next.x < this.cellPosition.xCoord){
                this.cellPosition.xCoord--;
                return Entity.LEFT;
            }
            else if(next.x > this.cellPosition.xCoord){
                this.cellPosition.xCoord++;
                return Entity.RIGHT;
            }
        }
    };

    return Entity;

});