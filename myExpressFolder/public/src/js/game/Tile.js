define([],function() {

    function Tile(){
        this.xPos = null;
        this.yPos = null;
        this.image = null;
        this.locked = false;
        this.hotspot = false;
        this.database = false;
        this.clumpID = null;
        this.startingPosition = false;
        this.ancestorStartingPosition = false;
        this.hasVirus = false;
    }

    return Tile;
});
