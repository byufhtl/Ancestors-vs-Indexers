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
        this.type = 0x00;
    }

    Tile.NONE       = 0x0000; // No Tiles

    // Walkables
    Tile.WALKABLE   = 0b0000000011111111; // Walkable Tiles
    Tile.NORMAL     = 0b0000000000000001; // Regular Tiles
    Tile.FAST       = 0b0000000000000010; // Quicker Tiles
    Tile.SLOW       = 0b0000000000000100; // Slower Tiles
    Tile.RISK       = 0b0000000000001000; // Risk Tiles
    Tile.LOCKED     = 0b0000000000010000; // Locked Tiles
    Tile.SECURE     = 0b0000000000100000; // Secure Tiles (treat as locked for other entities)

    // Structures
    Tile.STRUCTURE  = 0b1111111100000000; // Building Tiles
    Tile.ENVIRONMENT= 0b0000000100000000; // Environment Tiles (Static, no action, not walkable)
    Tile.SOURCE     = 0b0000001000000000; // Source Record Tiles
    Tile.ENDPOINT   = 0b0000010000000000; // Level Endpoint
    Tile.PORTAL     = 0b0000100000000000; // Portal to another area
    Tile.SPCL_EVNT  = 0b0001000000000000; // Undefined specialty event flag.
    Tile.EVENT_LOC  = 0b0010000000000000; // Scripted Event Location

    Tile.ALL        = 0xFFFF; // All Tiles

    Tile.prototype.addType = function(...types){
        for(var type of types) {
            this.type |= type;
        }
        return this;
    };

    Tile.prototype.hasTypeOR = function(...types){
        for(var type of types){
            if((this.type & type) || this.type == type){ // Second condition allows comparison to Tile.NONE
                return true;
            }
        }
        return false;
    };

    Tile.prototype.hasTypeAND = function(...types){
        for(var type of types){
            if(!(this.type & type) && this.type != type){ // Second condition allows comparison to Tile.NONE
                return false
            }
        }
        return true;
    };

    Tile.prototype.removeType = function(...types){
        for(var type of types){
            this.type &= (~type);
        }
        return this;
    };


    return Tile;
});
