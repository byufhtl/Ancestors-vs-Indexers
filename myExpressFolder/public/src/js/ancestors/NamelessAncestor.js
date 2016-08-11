/**
 * Created by calvinmcm on 6/22/16.
 */

define(['model/IAncestor'],function(IAncestor){

    function Nameless(){
        this.type = "nameless";
        this.speed = 80;

        this.animTimer = 0;
        this.animFrame = 0;
        this.numFrames = 4;
        this.timeBetweenFrames = .05;
    }

    Nameless.prototype = new IAncestor();

    Nameless.prototype.animation = null;

    Nameless.prototype.hp = 2;

    return Nameless;
});
