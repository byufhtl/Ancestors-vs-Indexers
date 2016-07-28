define([],function() {

    function IFadeAnim(lane) {
        this.hp = 1;
        this.speed = 30;
        this.currentGeneration = 3;
        this.animation;
        this.xCoord = 1000;
        this.yCoord = 300;
        this.distanceMovedX = 300;
        this.upOrDown = "up";
        this.type = "standard";

        this.animTimer = 0;
        this.animFrame = 0;
        this.numFrames = 4;
        this.timeBetweenFrames = .2;
    }

    return IFadeAnim;

});
