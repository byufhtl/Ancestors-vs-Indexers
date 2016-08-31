define([],function() {

    function Tile(){
        this.image = null;
        this.locked = false;
        this.hotspot = false;
        this.database = null;
        this.clumpID = null;
        this.startingPoint = false;
    }

    return Tile;
});
