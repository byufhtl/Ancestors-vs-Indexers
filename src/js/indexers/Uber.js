/**
 * Created by calvinmcm on 6/23/16.
 */

define(['model/IIndexer'],function(IIndexer){

    function Uber(){
        this.projectileOrientation = "upRight";
    }

    Uber.prototype = new IIndexer();

    Uber.prototype.type = "hobbyist";

    Uber.prototype.throwDelay = 1;

    Uber.prototype.dmg = 1000;

    Uber.prototype.getProjectile = function(){

        if (this.projectileOrientation == "upRight")
        {
            this.projectileOrientation = "downRight";
        }
        else
        {
              this.projectileOrientation = "upRight";
        }

        if(Math.round(Math.random() * 4) == 0){
            return {
                xCoord : this.xCoord + 5,
                yCoord : this.yCoord + 20,
                type : this.type,
                lane : this.lane,
                dmg : this.dmg * 2,
                type: "uber",
                orientation: this.projectileOrientation
            }
        }
        return {
            xCoord : this.xCoord + 5,
            yCoord : this.yCoord + 20,
            type : this.type,
            lane : this.lane,
            dmg : this.dmg,
            type: "uber",
            orientation: this.projectileOrientation
        }
    };

    return Uber;

});
