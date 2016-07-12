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

    Uber.prototype.update = function(activeAncestors, timeElapsed, activeProjectiles, levelStructure)
    {
        this.checkShootProjectile(timeElapsed, levelStructure, activeProjectiles);
    };

    Uber.prototype.checkShootProjectile = function(timeElapsed, levelStructure, activeProjectiles)
    {
        this.throwTimer += timeElapsed;
        if (this.throwTimer > this.throwDelay) {
            this.throwTimer = 0;
            var tempProjectile = this.getProjectile(levelStructure.length);
            tempProjectile.timeRemaining = 10; // 10 second timeout
            activeProjectiles.push(tempProjectile);
        }
    };

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
    };

    return Uber;

});
