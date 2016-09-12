/**
 * Created by calvinm2 on 9/8/16.
 */

define([],function(){

    function MixBoard(width, height, partWeightMap){
        this.tileArray = [height];
        for(var i = 0; i < this.tileArray.length; i++){
            this.tileArray[i] = [width];
            for(var j = 0; j < width; j++){
                this.tileArray[i][j] = null;
            }
        }
        this.partWeightMap = partWeightMap;
    }

    MixBoard.generate = function(params){
        var board = new MixBoard(params.metrics.width, params.metrics.height, params.partitionWeightMap);
    };

    return MixBoard;
});