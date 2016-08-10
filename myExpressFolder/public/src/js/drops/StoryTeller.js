define([],function() {

    function StoryTeller() {
        this.type = "standard";
        this.slowAmount = 15;
        this.slowRadius = 100;
        this.imgURL = "src/img/Storyteller.png";
    }


    StoryTeller.prototype.update = function(activeAncestors)
    {
        this.slowNearbyAncestors(activeAncestors);
    };

    StoryTeller.prototype.slowNearbyAncestors = function(activeAncestors)
    {
        var self = this;
        for (var i = 0; i < activeAncestors.length; i++){
            if (Math.abs(activeAncestors[i].xCoord - self.xCoord) < this.slowRadius && Math.abs(activeAncestors[i].yCoord - self.yCoord) < this.slowRadius){
                //the ancestor is in range, slow them
                console.log("slowing ancestor");
                activeAncestors[i].slowDuration = .15;
            }
        }
    };


    return StoryTeller;

});
