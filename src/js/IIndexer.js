define([],function() {

    function IIndexer() {
      this.throwDelay = 4;
      this.throwTimer = 0;
      this.lane;
      this.type = "standard";
      this.damage = 1;
    }

    return IIndexer;

});
