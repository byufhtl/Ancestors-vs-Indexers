define([],function() {

    function IAncestor(lane) {
        this.hp = 2;
        this.speed = 30;
        this.lane = lane;
        this.animation;
        this.xCoord = 1000;
        this.yCoord = 300;
        this.type = "standard";
    }

    return IAncestor;

});
