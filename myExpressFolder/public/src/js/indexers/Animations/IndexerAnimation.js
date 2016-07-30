/**
 * Created by calvin on 7/30/16.
 */

define([],function(){

    /**
     * Hard-coded animation sequence for the indexer sprite.
     * @constructor
     */
    function IndexerAnimation(){
        this.id = IndexerAnimation.count++;
        this.width = 50;
        this.height = 50;
        this.y = Math.floor(Math.random() * 6);
        this.x = 0;
        this.RIGHTFACE = 0;
        this.LEFTFACE = 6;
        this.RIGHTTHROW = 7;
        this.LEFTTHROW = 10;
        this.dtAnim = .15;
        this.longestAnimatedSequence = 10;
        console.log("Making a new Indexer with picture at (", this.x, this.y, ").");
    }

    IndexerAnimation.count = 0;

    IndexerAnimation.prototype.currentLocation = function(){
        return {x: this.x, y:this.y , width: this.width, height: this.height}
    };

    IndexerAnimation.prototype.jumpTo = function(place){
        this.x = place;
        console.log("Indexer", this.id, "jumping to animation", this.x);
    };

    IndexerAnimation.prototype.turnLeft = function(clock){
        for(var i = this.RIGHTFACE; i <= this.LEFTFACE; i++){
            clock.add(this.dtAnim * i, this.jumpTo, this.RIGHTFACE + i);
        }
        return(this.dtAnim * i); // return the lapse
    };

    /**
     * A reverse animation sequence of .turnLeft()
     * @param clock
     */
    IndexerAnimation.prototype.turnRight = function(clock){
        for(var i = this.LEFTFACE; i >= this.RIGHTFACE; i--){
            clock.add(this.dtAnim * i, this.jumpTo, this.RIGHTFACE + i);
        }
        return(this.dtAnim * (this.LEFTFACE - i)); // return the lapse
    };

    IndexerAnimation.prototype.throwRight = function(clock, delay){
        var i;
        delay = (delay) ? delay : 0;
        for(i = 0; i < 3; i++){ clock.add((this.dtAnim * i) + delay, this.jumpTo, this.RIGHTTHROW + i); }
        clock.add((this.dtAnim * ++i) + delay, this.jumpTo, this.RIGHTFACE);
        return(this.dtAnim * i); // return the lapse
    };

    IndexerAnimation.prototype.throwLeft = function(clock, delay){
        var i;
        delay = (delay) ? delay : 0;
        for(i = 0; i < 3; i++){ clock.add((this.dtAnim * i) + delay, this.jumpTo, this.LEFTTHROW + i); }
        clock.add((this.dtAnim * ++i) + delay, this.jumpTo, this.LEFTFACE);
        return(this.dtAnim * i); // return the lapse
    };

    IndexerAnimation.prototype.turnLeftThrow = function(clock){
        var lapse = this.turnLeft(clock);
        lapse += this.throwLeft(clock, lapse + this.dtAnim);
        return lapse;
    };

    IndexerAnimation.prototype.turnRightThrow = function(clock){
        var lapse = this.turnRight(clock);
        lapse += this.throwRight(clock, lapse + this.dtAnim);
        return lapse;
    };

    IndexerAnimation.prototype.safeIntervalTime = function(){
        return this.longestAnimatedSequence * this.dtAnim;
    }
    return IndexerAnimation;
});