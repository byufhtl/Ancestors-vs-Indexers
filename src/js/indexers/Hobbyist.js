/**
 * Created by calvinmcm on 6/23/16.
 */

define(['model/IIndexer'],function(IIndexer){

    function Hobbyist(){
        this.projectileOrientation = "up";
    }

    Hobbyist.prototype = new IIndexer();

    Hobbyist.prototype.type = "hobbyist";

    Hobbyist.prototype.throwDelay = 3;

    Hobbyist.prototype.dmg = 1;

    Hobbyist.prototype.getProjectile = function(){

        if (this.projectileOrientationorientation == "up")
        {
            this.projectileOrientationorientation = "down";
        }
        else
        {
              this.projectileOrientation = "up";
        }

        if(Math.round(Math.random() * 4) == 0){
            return {
                xCoord : this.xCoord + 5,
                yCoord : this.yCoord + 20,
                type : this.type,
                lane : this.lane,
                dmg : this.dmg * 2,
                type: "strong",
                orientation: this.projectileOrientation
            }
        }
        return {
            xCoord : this.xCoord + 5,
            yCoord : this.yCoord + 20,
            type : this.type,
            lane : this.lane,
            dmg : this.dmg,
            type: "normal",
            orientation: this.projectileOrientation
        }
    }

    return Hobbyist;

});
