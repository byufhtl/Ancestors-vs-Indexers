/**
 * Created by calvinmcm on 6/22/16.
 */

define(['model/IAncestor'],function(IAncestor){

    function Nameless(lane){
        this.lane = lane;
        this.type = "nameless";
    }

    Nameless.prototype = new IAncestor(Nameless.prototype.lane);

    Nameless.prototype.animation = null;
    
    Nameless.prototype.hp = 3;

    Nameless.prototype.animTimer = 0;

    Nameless.prototype.animFrame = 0;

    Nameless.prototype.numFrames = 13;

    Nameless.prototype.timeBetweenFrames = .05;

    return Nameless;
});
