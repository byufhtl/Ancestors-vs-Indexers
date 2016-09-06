/**
 * Created by calvinm2 on 9/6/16.
 */

define([],function(){

    function Virus(row, col, board){
        this.cellPosition = {xCoord: col, yCoord: row};
        this.pixelPosition = {xCoord: col, yCoord: row};
        this.speed = 150;
        this.target = null;
        this.currSeek = this.__meanderSeek(board);
    }

    /**
     * The movement function for the virus. Selects a destination point based on a number of different factors, and then
     * moves towards that destination point in the most efficient way possible.
     * @param timeElapsed
     * @param board
     * @param player
     */
    Virus.prototype.move = function(timeElapsed, board, player){
        if(player){
            var currPlayerClump = board[player.playerCellPosition.yCoord][player.playerCellPosition.xCoor].clumpID;
            var currViralClump = board[this.cellPosition.yCoord][this.cellPosition.xCoord].clumpID;
            if(currPlayerClump == currViralClump){
                this.target = player;
                this.currSeek = this.__huntSeek();
            }
        }
    };

    /**
     * The logic for selecting a new destination in hunting mode.
     * @param board
     * @private
     */
    Virus.prototype.__huntSeek = function(board){
        if(board && this.target){

        }
        else{
            return this.__meanderSeek(board);
        }
    };

    /**
     * A wandering path-selection function
     * @param board
     * @private
     */
    Virus.prototype.__meanderSeek = function(board){
        if(board){

        }
    };

    return Virus;

});