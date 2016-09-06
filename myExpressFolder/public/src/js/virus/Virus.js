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

    Virus.prototype.__huntSeek = function(board){
        if(board && this.target){

        }
        else{
            return this.__meanderSeek(board);
        }
    };

    Virus.prototype.__meanderSeek = function(board){
        if(board){

        }
    };

    return Virus;

});