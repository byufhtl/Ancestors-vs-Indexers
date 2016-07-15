define(['model/FadeAnimation'],function(FadeAnimation) {

    function FallingRecordAnim() {
        this.xCoord = 0;
        this.yCoord = 0;
        this.xOffset = -50;
        this.yOffset = -50;
        this.myWidth = 100;
        this.myHeight = 100;
        this.canvasOffset = false;
        this.img = "rec_animatedFade";
        this.animTimer = 0;
        this.animFrame = 0;
        this.numFrames = 12;
        this.timeBetweenFrames = .05;
    }

    FallingRecordAnim.prototype = new FadeAnimation();


    return FallingRecordAnim;
});
