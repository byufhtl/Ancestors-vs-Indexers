/**
 * Created by calvinmcm on 6/22/16.
 */

define(['model/IAncestor'],function(IAncestor){

    function FamilyMember(lane){
        this.lane = lane;
        this.type = "familyMember";
        this.name = "joe";
        this.data;
        this.hp = 1;
        this.speed = 20;
        this.animTimer = 0;
    }

    FamilyMember.prototype = new IAncestor(FamilyMember.prototype.lane);

    FamilyMember.prototype.animation = null;

    FamilyMember.prototype.animTimer = 0;

    FamilyMember.prototype.numFrames = 13;

    FamilyMember.prototype.timeBetweenFrames = .05;

    return FamilyMember;
});
