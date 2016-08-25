define(["indexers/Indexer_Animated"],function (Indexer_Animated) {

    function Indexer2(){
        this.throwDelay = 1;
        this.throwTimer = 0;
        this.xNode = 0;
        this.yNode = 0;
        this.type = "standard2";
        this.dmg = 1;
        this.projectileOrientation = "upRight";
        this.direction = "right";

    }

    Indexer2.prototype = new Indexer_Animated();

    return Indexer2;

});
