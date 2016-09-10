/**
 * Created by calvinmcm on 6/22/16.
 */

define(['model/IAncestor'],function(IAncestor){

    function FamilyMember(row, column){
        this.type = "familyMember";
        this.name = "joe";
        this.data;

        this.cellPosition = {xCoord:column,yCoord:row};
        this.pixelPosition = {xCoord:column*150, yCoord:row*150};
        this.currentDirection = null;
        this.nextDirection = null;
        this.distanceTraveled = 0;
        this.speed = 150;

        this.animTimer = 0;
        this.animFrame = 0;
        this.timeBetweenFrames = 1;
    }

    FamilyMember.prototype = new IAncestor(FamilyMember.prototype.lane);

    return FamilyMember;
});
