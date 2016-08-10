/**
 * Created by calvinmcm on 6/22/16.
 */

define(['model/IAncestor'],function(IAncestor){

    function Nameless(lane){
        this.lane = lane;
        this.type = "nameless";
        this.speed = 50;

        this.animTimer = 0;
        this.animFrame = 0;
        this.numFrames = 4;
        this.timeBetweenFrames = .05;
    }

    Nameless.prototype = new IAncestor(Nameless.prototype.lane);

    Nameless.prototype.animation = null;

    Nameless.prototype.hp = 3;

    return Nameless;
});
