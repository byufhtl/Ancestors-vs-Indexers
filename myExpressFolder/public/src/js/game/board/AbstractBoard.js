/**
 * Created by calvinm2 on 9/20/16.
 */

define(["game/Tile"],function(Tile){

    function AbstractBoard(){

    }

    AbstractBoard.prototype = {
        generate: function(leveldata){

        }
        , getBoard: function(){
            return this.tileArray;
        }
    };

    return AbstractBoard;
});