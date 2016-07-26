/**
 * Created by calvinmcm on 6/22/16.
 */

define(['model/IAncestor'],function(IAncestor){

    function FamilyMember(lane){
        this.lane = lane;
        this.type = "familyMember";
        this.name = "joe";
        this.data;
    }

    FamilyMember.prototype = new IAncestor(FamilyMember.prototype.lane);

    FamilyMember.prototype.animation = null;

    FamilyMember.prototype.hp = 1;

    FamilyMember.prototype.animTimer = 0;

    FamilyMember.prototype.animFrame = 0;

    FamilyMember.prototype.numFrames = 13;

    FamilyMember.prototype.timeBetweenFrames = .05;

    return FamilyMember;
});
