/**
 * Created by ztnelson on 7/11/16.
 */


define(['model/IIndexer'],function(IIndexer){

    function Specialist(){
        this.chargeRecordTimer = 0;
        this.movedDistance = 335;
        this.speed = 90;
        this.normSpeed = Math.sqrt((this.speed * this.speed) * 4 / 5);
        this.normSpeedY = this.normSpeed/2;
        this.type = "specialist";

        this.recordsCharged = 0;
        this.recordsOnHand = 1;

        this.moveDirection = "pause";

        this.movingTowardBase = false;

        this.xCoord;
        this.yCoord;

        this.homeXCoord;
        this.homeYCoord;
    }

    Specialist.prototype = new IIndexer();


    Specialist.prototype.update = function(activeAncestors, timeElapsed, activeProjectiles, levelStructure)
    {
        var checkDistance;
        if (this.moveDirection == "up" || this.moveDirection == "down") checkDistance = 300;
        else checkDistance = 335;
        this.checkCollisionWithAncestor(activeAncestors);
        this.checkStatus(timeElapsed);
        if (this.movedDistance >= checkDistance)
        {
            this.recharge();
            this.getDirection(activeAncestors);
        }
        if (this.moveDirection == "pause")
        {
            this.recharge();
            this.getDirection(activeAncestors);
        }
        this.move(timeElapsed);
    };

    Specialist.prototype.checkCollisionWithAncestor = function(activeAncestors)
    {

        if (this.movingTowardBase == false) {
            for (var i = 0; i < activeAncestors.length; i++) {
                if ((Math.abs(activeAncestors[i].xCoord - this.xCoord) < 20) && (Math.abs(activeAncestors[i].yCoord - this.yCoord) < 20)) {

                    //A Collision Happened
                    var iterations = this.recordsOnHand;
                    for (var j = 0; j < iterations; j++)
                    {
                        if (activeAncestors[i].hp > 0) {
                            activeAncestors[i].hp -= 1;
                            this.recordsOnHand--;
                        }
                        if (this.recordsOnHand > 0)
                        {
                            this.reEvaluateDirectionAncestor(activeAncestors);
                        }
                        else
                        {
                            this.reEvaluateDirectionHome();
                        }
                    }
                }
            }
        }
    };

    Specialist.prototype.recharge = function()
    {
        if (Math.abs(this.xCoord - this.homeXCoord) < 20 && Math.abs(this.yCoord - this.homeYCoord) < 20)
        {
            this.recordsOnHand += this.recordsCharged;
            this.recordsCharged = 0;
            this.movingTowardBase = false;
        }
    };
    Specialist.prototype.checkStatus = function(timeElapsed)
    {
        this.chargeRecordTimer += timeElapsed;
        //console.log("recordTimer: " + this.chargeRecordTimer);
        if (this.chargeRecordTimer >= 8)
        {
            this.chargeRecordTimer = 0;
            this.recordsCharged+=2;
        }

        if (this.recordsOnHand == 0)
        {
            this.movingTowardBase = true;
        }
    };

    Specialist.prototype.switchDirection = function(x_diff, y_diff)
    {
        //x_dif > 0 should go left
        //y_dif > 0 should go up

        if (x_diff > 0) //go left
        {
            if (this.moveDirection == "downRight")
            {
                this.moveDirection = "upLeft";
                this.movedDistance = 335 - this.movedDistance;
            }
            if (this.moveDirection == "upRight")
            {
                this.moveDirection = "downLeft";
                this.movedDistance = 335 - this.movedDistance;
            }

        }
        else if (x_diff < 0)    //go right
        {
            if (this.moveDirection == "upLeft")
            {
                this.moveDirection = "downRight";
                this.movedDistance = 335 - this.movedDistance;

            }
            else if (this.moveDirection == "downLeft")
            {
                this.moveDirection = "upRight";
                this.movedDistance = 335 - this.movedDistance;
            }
        }
        else if (y_diff > 0) //go up
        {
            if (this.moveDirection == "downLeft")
            {
                this.moveDirection = "upRight";
                this.movedDistance = 335 - this.movedDistance;

            }
            else if (this.moveDirection == "downRight")
            {
                this.moveDirection = "upLeft";
                this.movedDistance = 335 - this.movedDistance;
            }
        }
        else if (y_diff < 0) //go down
        {
            if (this.moveDirection == "upRight")
            {
                this.moveDirection = "downLeft";
                this.movedDistance = 335 - this.movedDistance;

            }
            else if (this.moveDirection == "upLeft")
            {
                this.moveDirection = "downRight";
                this.movedDistance = 335 - this.movedDistance;
            }
        }
        else if (this.moveDirection == "up" && y_diff < 0)
        {
            this.moveDirection = "down";
            this.movedDistance = 300 - this.movedDistance;
        }
        else if (this.moveDirection == "down" && y_diff > 0)
        {
            this.moveDirection = "up";
            this.movedDistance = 300 - this.movedDistance;
        }

    };

    Specialist.prototype.reEvaluateDirectionAncestor = function(activeAncestors)
    {
        var leftMostAncestor;
        //if not going toward base move toward leftmost ancestor
        if (!this.movingTowardBase) {
            var leftMostX = 100000;
            for (var i = 0; i < activeAncestors.length; i++) {
                if (activeAncestors[i].xCoord < leftMostX) {
                    leftMostAncestor = activeAncestors[i];
                    leftMostX = activeAncestors[i].xCoord;
                }
                else if (Math.abs(activeAncestors[i].xCoord - leftMostX) == 0)
                {
                    var firstDistance = Math.abs(leftMostAncestor.y - this.yCoord);
                    var secondDistance = Math.abs(activeAncestors[i].yCoord - this.yCoord);
                    if (secondDistance < firstDistance)
                    {
                        leftMostAncestor = activeAncestors[i];
                        leftMostX = activeAncestors[i].xCoord;
                    }
                }
            }
        }
        var x_diff = this.xCoord - leftMostAncestor.xCoord;
        var y_diff = this.yCoord - leftMostAncestor.yCoord;
        this.switchDirection(x_diff, y_diff);
    };

    Specialist.prototype.reEvaluateDirectionHome = function(){
        //check to see if we need to turn around, basically.
        //get position relative to the base
        var x_diff = this.xCoord - this.homeXCoord;
        var y_diff = this.yCoord - this.homeYCoord;
        this.switchDirection(x_diff, y_diff);
    };

    Specialist.prototype.getDirection = function(activeAncestors)
    {
        if (activeAncestors.length == 0)
        {
            this.moveDirection = "pause";
            return;
        }

        this.movedDistance = 0;

        if (this.recordsOnHand == 0 && Math.abs(this.xCoord - this.homeXCoord) < 20 && Math.abs(this.yCoord - this.homeYCoord) < 20)
        {
            this.moveDirection = "pause";
            return;
        }

        var leftMostAncestor;
        //if not going toward base move toward leftmost ancestor
        if (!this.movingTowardBase) {
            var leftMostX = 100000;
            for (var i = 0; i < activeAncestors.length; i++) {
                if (activeAncestors[i].xCoord < leftMostX) {
                    leftMostAncestor = activeAncestors[i];
                    leftMostX = activeAncestors[i].xCoord;
                }
                else if (Math.abs(activeAncestors[i].xCoord - leftMostX) == 0)
                {
                    var firstDistance = Math.abs(leftMostAncestor.y - this.yCoord);
                    var secondDistance = Math.abs(activeAncestors[i].yCoord - this.yCoord);
                    if (secondDistance < firstDistance)
                    {
                        leftMostAncestor = activeAncestors[i];
                        leftMostX = activeAncestors[i].xCoord;
                    }
                }
            }
        }   //move toward base to pick up records
        else
        {
            leftMostAncestor = {};
            leftMostAncestor.xCoord = this.homeXCoord;
            leftMostAncestor.yCoord = this.homeYCoord;
        }

        //positive: go left
        var x_diff = this.xCoord - leftMostAncestor.xCoord;
        //positive: go up
        var y_diff = this.yCoord - leftMostAncestor.yCoord;

        if (y_diff > 0 && x_diff > 0)
        {
            // up-left
            this.moveDirection = "upLeft";
        }
        else if (y_diff > 0 && x_diff < 0)
        {
            // up-right
            if (Math.abs(x_diff)/Math.abs(y_diff) >= 1)
            {
                this.moveDirection = "upRight";
            }
            else
            {
                this.moveDirection = "up";
            }
        }
        else if (y_diff < 0 && x_diff > 0)
        {
            //down-left
            this.moveDirection = "downLeft";
        }
        else if (y_diff < 0 && x_diff < 0) {
            //down-right
            if (Math.abs(x_diff) / Math.abs(y_diff) >= 1) {
                this.moveDirection = "downRight";
            }
            else {
                this.moveDirection = "down";
            }
        }

        if (this.movingTowardBase && y_diff < 0 && Math.abs(x_diff) < 5)
        {
            this.moveDirection = "down";
        }
        if (this.movingTowardBase && y_diff > 0 && Math.abs(x_diff) < 5)
        {
            this.moveDirection = "up";
        }
    };



    Specialist.prototype.move = function(timeElapsed)
    {
        var self = this;
        if (this.moveDirection != "pause") {
            this.movedDistance += this.speed * timeElapsed;
        }
        switch (this.moveDirection)
        {
            case "up":
                self.yCoord -= self.speed * timeElapsed;
                break;
            case "upRight":
                self.yCoord -= self.normSpeedY * timeElapsed;
                self.xCoord += self.normSpeed * timeElapsed;
                break;
            case "downRight":
                self.yCoord += self.normSpeedY * timeElapsed;
                self.xCoord += self.normSpeed * timeElapsed;
                break;
            case "down":
                self.yCoord += self.speed * timeElapsed;
                break;
            case "downLeft":
                self.yCoord += self.normSpeedY * timeElapsed;
                self.xCoord -= self.normSpeed * timeElapsed;
                break;
            case "upLeft":
                self.yCoord -= self.normSpeedY * timeElapsed;
                self.xCoord -= self.normSpeed * timeElapsed;
                break;
        }
    };

    return Specialist;

});
