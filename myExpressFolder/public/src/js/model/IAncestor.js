define([],function() {

    function IAncestor(lane) {
        this.hp = 1;
        this.speed = 30;
        this.currentGeneration = 3;
        this.animation;
        this.xCoord = 1000;
        this.yCoord = 300;
        this.distanceMovedX = 300;
        this.upOrDown = "up";
        this.type = "standard";
    }

    return IAncestor;

});
