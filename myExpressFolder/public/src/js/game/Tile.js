define([],function() {

    function Tile(){
        this.image = null;
        this.locked = false;
        this.hotspot = false;
        this.database = false;
        this.startingPosition = false;
        this.ancestorStartingPosition = false;
    }

    return Tile;
});
