/**
 * Created by calvinm2 on 9/6/16.
 */

define(["../entities/Entity", "../paths/Pathfinder", "../util/CoordUtils"],function(Entity, Pathfinder, CoordUtils){

    function Virus(row, col){
        this.cellPosition = {xCoord: col, yCoord: row};
        this.pixelPosition = {xCoord: col*150, yCoord: row*150};
        this.currDir = null;
        this.prevDir = null;
        this.distanceTraveled = 0;
        this.speed = 150;
        this.path = [];

        this.currImage = null;
        this.animation = null;

        this.pathfinder = new Pathfinder();

        // this.target = null;
        // this.currSeek = this.__meanderSeek(board);
    }

    Virus.prototype = Entity.prototype;

    Virus.prototype.setTarget = function(target){
        this.target = target;
    };

    Virus.prototype.poll = function(){
        console.log("<<@Virus>> cell:", this.cellPosition, "pixel:", this.pixelPosition);
    };

    Virus.prototype.newPath = function(board){
        // console.log("<<VIRUS>> Alternative Algorithm.");
        var startingCoords = {x: this.cellPosition.xCoord, y: this.cellPosition.yCoord};
        var endingCoords;
        if(this.target && this.target.playerCellPosition){
            var px = this.target.playerCellPosition.xCoord;
            var py = this.target.playerCellPosition.yCoord;
            // Duuuuuh DUN Duuuuuh DUN Duuuh DUN Duuh DUN Duh DUN DUUUUUUUUUUUUNNNN!!!!
            if(CoordUtils.proximate(this.cellPosition.xCoord, this.cellPosition.yCoord, px, py, 3)) {
                console.log("POOOWWWEEERRR!!!");
                this.speed = 350;
                endingCoords = {x: px, y: py};
                return this.pathfinder.findPathTo(board, startingCoords, endingCoords);
            }
            // I SEE YOU.
            else if(CoordUtils.proximate(this.cellPosition.xCoord, this.cellPosition.yCoord, px, py, 6)){
                console.log("Set X-Foils to attack position.");
                this.speed = 250;
                endingCoords = {x: px, y: py};
                return this.pathfinder.findPathToward(board, startingCoords, endingCoords, 3);
            }
            // THERE IS A DISTURBANCE IN THE FORCE...
            else if(CoordUtils.proximate(this.cellPosition.xCoord, this.cellPosition.yCoord, px, py, 15)){
                console.log("Set your guns to stun.");
                this.speed = 200;
                endingCoords = {x: px, y: py};
                return this.pathfinder.findPathToward(board, startingCoords, endingCoords, 6);
            }
        }
        // DEFAULT Distance Logic
        // console.log("He shall come to us...");
        this.speed = 150;
        var virusClumpID = board.tileArray[this.cellPosition.yCoord][this.cellPosition.xCoord].clumpID;
        // console.log("Clump id:", virusClumpID);
        var clump = board.__clumpToTile[virusClumpID];
        var coord = {col: -1, row: -1};
        do {
            coord = clump[Math.floor(Math.random() * clump.length)];
        } while (coord.col == this.cellPosition.xCoord || coord.row == this.cellPosition.yCoord);

        endingCoords = {x: coord.col, y: coord.row};
        return this.pathfinder.findPathToward(board, startingCoords, endingCoords);

    };

    // /**
    //  * The movement function for the virus. Selects a destination point based on a number of different factors, and then
    //  * moves towards that destination point in the most efficient way possible.
    //  * @param timeElapsed
    //  * @param board
    //  * @param player
    //  */
    // Virus.prototype.move = function(timeElapsed, board, player){
    //     if(player){
    //         var currPlayerClump = board[player.playerCellPosition.yCoord][player.playerCellPosition.xCoor].clumpID;
    //         var currViralClump = board[this.cellPosition.yCoord][this.cellPosition.xCoord].clumpID;
    //         if(currPlayerClump == currViralClump){
    //             this.target = player;
    //             this.currSeek = this.__huntSeek();
    //         }
    //     }
    // };
    //
    // /**
    //  * The logic for selecting a new destination in hunting mode.
    //  * @param board
    //  * @private
    //  */
    // Virus.prototype.__huntSeek = function(board){
    //     if(board && this.target){
    //
    //     }
    //     else{
    //         return this.__meanderSeek(board);
    //     }
    // };
    //
    // /**
    //  * A wandering path-selection function
    //  * @param board
    //  * @private
    //  */
    // Virus.prototype.__meanderSeek = function(board){
    //     if(board){
    //
    //     }
    // };
    //
    return Virus;

});