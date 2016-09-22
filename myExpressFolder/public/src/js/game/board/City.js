/**
 * Created by calvinm2 on 9/20/16.
 */

define(["game/Tile", "game/board/AbstractBoard", "game/board/BoardUtils"], function(Tile, AbsBoard, BoardUtils){

    function City(){
        this.tileArray = [];
    }

    City.prototype = AbsBoard;

    City.prototype.generate = function(levelData){
        if(!levelData.hasOwnProperty("numDBs") || !levelData.hasOwnProperty("numExtraClumps")){
            console.log("Nada!!");
            return [[]];
        }
        var size = levelData.numDBs + levelData.numExtraClumps;
        var clumps = [];
        var DBsLeft = levelData.numDBs;
        var DBsForCenter = Math.floor(Math.round((DBsLeft + 1)/2));
        DBsLeft -= DBsForCenter;
        clumps.push(City.generateCityBlock(7, false, true))
    };

    City.prototype.generateCenter = function(size, dbsleft, levelData){
        size = (size > 4) ? size*2 : 10;
        var arr = City.generateBlock(size);
        console.log("Has block");
        for(var i = 0; i < dbsleft; i++){
            var cont = true;
            do{
                var x = Math.floor(Math.random() * (size - 2)) + 1;
                var y = Math.floor(Math.random() * (size - 2)) + 1;

                if(BoardUtils.isOnBoard(y, x, arr) && City.isGoodNeighbor(x, y, arr)){
                    arr[y][x].addType(Tile.SOURCE);
                    arr[y][x].numRecords = levelData.numAncestors / levelData.numDBs;
                    cont = false;
                }
            }while(cont);
        }
        BoardUtils.printArray(arr);
        return arr;
    };

    /**
     * An ease-of-use function for generating city blocks with the outsides marked as roads.
     * @param w
     * @param h
     */
    City.generateBlock = function(w, h = w){
        var arr = BoardUtils.makeBoard(w, h, true);
        for(var i = 0; i < h; i++){
            for(var j = 0; j < w; j++){
                if(i == 0 || (i+1) == h || j == 0 || (j+1) == w){
                    arr[i][j].addType(Tile.FAST);
                    arr[i][j].removeType(Tile.SLOW);
                    arr[i][j].removeType(Tile.NORMAL);
                }
                else if(j == 1 || (j + 2) == w || i == 1 || (i + 2) == h){
                    arr[i][j].addType(Tile.NORMAL);
                }
            }
        }
        return arr;
    };

    City.isGoodNeighbor = function(x, y, arr){
        var neighbors= BoardUtils.getNeighbors(y, x, arr);
        for(var neighbor of neighbors){
            var tile = arr[neighbor.row][neighbor.col];
            // console.log("Checking neighbor", neighbor.row, neighbor.col, ":", tile.type);
            if(tile.hasTypeOR(Tile.NORMAL)){
                return true;
            }
        }
        return false;
    };

    City.generateInnerCity = function(size, DBCount){

    };

    City.generateCityBlock = function(fill, hasDB, hasCourthouse){
        var arr = City.generateBlock(7,7);
        switch(Math.floor(Math.random() * 4)){
            case 1:
                arr[4][3].addType(Tile.NORMAL);
                break;
            case 2:
                arr[4][5].addType(Tile.NORMAL);
                break;
            case 3:
                arr[3][4].addType(Tile.NORMAL);
                break;
            case 4:
                arr[5][4].addType(Tile.NORMAL);
                break;
        }
        var limit = 8;
        if(hasDB){--limit;}
        if(hasCourthouse){--limit;}
        fill = (fill <= limit) ? fill : limit;
        var spot;
        for(var i = 0; i < fill; i++){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.ENVIRONMENT);
        }
        if(hasDB){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.SOURCE);
        }
        if(hasCourthouse){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.ENDPOINT);
        }
        City.fillWith(arr, Tile.NORMAL);
        BoardUtils.printArray(arr);
        return arr;
    };

    City.generateSuburbBlock = function(fill, hasDB){

    };

    City.generateCountryBlock = function(fill, hasDB){

    };

    City.findHouseSpot = function(arr){
        do{
            var y = Math.floor((Math.random() * (arr.length - 4)) + 2);
            var x = Math.floor((Math.random() * (arr[y].length - 4)) + 2);

            if(BoardUtils.isOnBoard(y, x, arr)){
                if(arr[y][x].hasTypeOR(Tile.NONE)){
                    if(City.isGoodNeighbor(x, y, arr)){
                        return BoardUtils.genPair(x,y);
                    }
                }
            }
        }while(1);
    };

    City.fillWith = function(arr, fillType){
        var i = 0;
        for(i; i < arr.length; i++){
            var j = 0;
            for(j; j < arr[i].length; j++){
                if(BoardUtils.isOnBoard(i,j,arr) && arr[i][j].hasTypeOR(Tile.NONE)){
                    arr[i][j].addType(fillType);
                }
            }
        }
    };

    return City;
});