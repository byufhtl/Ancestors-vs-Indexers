define([],function() {

    function FadeAnimation() {
        this.img = "rec_animatedFade";

        this.xCoord = 0;
        this.yCoord = 0;
        this.xBuffer = 20;
        this.yBuffer = 20;
        this.myWidth = 100;
        this.myHeight = 100;
        this.animTimer = 0;
        this.animFrame = 0;
        this.numFrames = 0;
        this.timeBetweenFrames = 0;
        this.die = false;

        this.canvasOffset = true;
    }

    FadeAnimation.prototype.updateFrames = function(timeElapsed)
    {
        this.animTimer += timeElapsed;
        this.yCoord += timeElapsed * 5;
        if (this.animTimer > this.timeBetweenFrames)
        {
            this.animTimer = 0;
            this.animFrame++;
            if (this.animFrame >= this.numFrames - 1)
            {
                this.die = true;
                this.animFrame = this.numFrames - 1;
            }
        }
    }

    return FadeAnimation;
});
