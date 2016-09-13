/**
 * Created by calvinm2 on 9/6/16.
 */

define(["../entities/Entity", "../paths/Pathfinder"],function(Entity, Pathfinder){

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

    Virus.prototype.poll = function(){
        console.log("<<@Virus>> cell:", this.cellPosition, "pixel:", this.pixelPosition);
    };

    Virus.prototype.newPath = function(board){
        console.log("<<VIRUS>> Alternative Algorithm.");
        var virusClumpID = board.tileArray[this.cellPosition.yCoord][this.cellPosition.xCoord].clumpID;
        console.log("Clump id:", virusClumpID);
        var clump = board.__clumpToTile[virusClumpID];
        var coord = {col:-1, row:-1};
        do{
            coord = clump[Math.floor(Math.random() * clump.length)];
        }while(coord.col == this.cellPosition.xCoord || coord.row == this.cellPosition.yCoord);

        var startingCoords = {x: this.cellPosition.xCoord, y: this.cellPosition.yCoord};
        var endingCoords = {x: coord.col, y: coord.row};
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