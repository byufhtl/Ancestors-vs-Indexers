/**
 * Created by calvinmcm on 6/22/16.
 */

define(['model/IAncestor'],function(IAncestor){

    function Wagon(){
        this.type = "wagon";
        this.speed = 15;

        this.animTimer = 0;
        this.animFrame = 0;
        this.numFrames = 2;
        this.timeBetweenFrames = .05;
    }

    Wagon.prototype = new IAncestor();

    Wagon.prototype.animation = null;

    Wagon.prototype.hp = 5;

    return Wagon;
});
