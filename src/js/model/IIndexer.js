define([],function() {

    function IIndexer() {
      this.throwDelay = 4;
      this.throwTimer = 0;
      this.lane;
      this.type = "standard";
      this.dmg = 1;
    }

    IIndexer.prototype.getProjectile = function(){
        return {
            xCoord : this.xCoord + 5,
            yCoord : this.yCoord + 20,
            type : this.type,
            lane : this.lane,
            dmg : this.dmg,
            type: "normal"
        }
    };

    return IIndexer;

});
