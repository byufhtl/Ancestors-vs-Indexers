define([],function() {

    function Tile(){
        this.image = null;
        this.locked = false;
        this.hotspot = false;
        this.database = false;
        this.clumpID = null;
        this.startingPosition = false;
    }

    return Tile;
});
