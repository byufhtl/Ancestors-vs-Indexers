/**
 * Created by calvinmcm on 6/22/16.
 */

define(['model/IAncestor'],function(IAncestor){

    function Nameless(lane){
        this.lane = lane;
        this.type = "familyMember";
        this.name = "joe";

    }

    Nameless.prototype = new IAncestor(Nameless.prototype.lane);

    Nameless.prototype.hp = 7;

    return Nameless;
});
