/**
 * Created by calvin on 7/30/16.
 */


define(['indexers/Animations/IndexerAnimation', 'model/Projectile'],function (Animation, Projectile) {

    console.log("\n\n\nHEY!!! HELLO!!! LISTEN!!!\n\n\nHEY!!! HELLO!!! LISTEN!!!\n\n\n-");
    function Indexer_Animated(){
        this.throwDelay = 4;
        this.throwTimer = 0;
        this.xNode = 0;
        this.yNode = 0;
        this.type = "standard";
        this.dmg = 1;
        this.projectileOrientation = "upRight";
        this.direction = "right";
        this.animation = new Animation(); // Creates one of 6 animation patterns.
        if(this.throwDelay < this.animation.safeIntervalTime()){
            console.log("Indexer_Animated Animation lasts longer than throw delay... Animations may interrupt each other")
        }
    }

    Indexer_Animated.prototype.initialize = function(numGenerations){
        var self = this;
        self.canShootUpLeft = true;
        self.canShootUpRight = true;
        self.canShootDownLeft = true;
        self.canShootDownRight = true;

        if (this.yNode == 0) {
            self.canShootUpLeft = false;
        }
        if (this.yNode == this.xNode)
        {
            self.canShootDownLeft = false;
        }
        if (this.xNode == numGenerations)
        {
            self.canShootUpRight = false;
            self.canShootDownRight = false;
        }
        if (this.xNode == 0)
        {
            self.canShootUpLeft = false;
            self.canShootDownLeft = false;
        }
        if (this.xNode == numGenerations && this.yNode == numGenerations)
        {
            self.canShootDownLeft = false;
            self.canShootUpRight = false;
            self.canShootDownRight = false;
        }
        if (this.xNode == numGenerations && this.yNode == 0)
        {
            self.canShootUpRight = false;
            self.canShootDownRight = false;
            self.canShootUpLeft = false;
        }
    };

    Indexer_Animated.prototype.getAnimation = function(){
        // console.log(this.animation.getStatus());
        return this.animation;
    };

    /**
     * Performs all updates on an indexer
     * @param activeAncestors The list of ancestors currently on the field.
     * @param timeElapsed The amount of time elapsed since the last update.
     * @param activeProjectiles The projectiles active on the field.
     * @param levelStructure The structure of the level.
     * @param eventClock The clock handling indexer-related timer events.
     */
    Indexer_Animated.prototype.update = function(activeAncestors, timeElapsed, activeProjectiles, levelStructure, eventClock) {
        this.checkShootProjectile(timeElapsed, levelStructure, activeProjectiles, eventClock);
    };

    /**
     * Checks whether or not the indexer can shoot another record. If so, schedules an appropriate animation sequence
     * and the projectile shoot event to the eventClock timer.
     * @param timeElapsed The amount of time elapsed since the last update.
     * @param levelStructure The structure of the level.
     * @param activeProjectiles The projectiles active on the field.
     * @param eventClock The clock handling indexer-related timer events.
     */
    Indexer_Animated.prototype.checkShootProjectile = function(timeElapsed, levelStructure, activeProjectiles, eventClock) {
        this.throwTimer += timeElapsed;
        if (this.throwTimer > this.throwDelay) {
            this.throwTimer = 0;
            var tempProjectile = this.getProjectile(levelStructure.length);
            var projectileData = {activeProjectiles:activeProjectiles, newProjectile: tempProjectile};
            if(eventClock) {
                if (tempProjectile.orientation == "upRight" || tempProjectile.orientation == "downRight") {
                    if (this.direction == "right") {
                        eventClock.add(this.animation.throwRight(eventClock, 0) - this.animation.dtAnim, this.shootProjectile, projectileData);
                    }
                    else if (this.direction == "left") {
                        eventClock.add(this.animation.turnRightThrow(eventClock) - this.animation.dtAnim, this.shootProjectile, projectileData);
                        this.direction = "right";
                    }
                }
                else if (tempProjectile.orientation == "upLeft" || tempProjectile.orientation == "downLeft") {
                    if (this.direction == "left") {
                        eventClock.add(this.animation.throwLeft(eventClock, 0) - this.animation.dtAnim, this.shootProjectile, projectileData);
                    }
                    else if (this.direction == "right") {
                        eventClock.add(this.animation.turnLeftThrow(eventClock) - this.animation.dtAnim, this.shootProjectile, projectileData);
                        this.direction = "left";
                    }
                }
            }
            else{
                this.shootProjectile(projectileData);
            }
        }
    };

    /**
     * Callback function for shooting a projectile. Attaches a timeout to the projectile as well as appending it to the
     * list of active projectiles.
     * @param projectileData An object containing the list of active projectiles and the projectile to add to it.
     */
    Indexer_Animated.prototype.shootProjectile = function(projectileData){
        projectileData.activeProjectiles.push(projectileData.newProjectile);
        projectileData.newProjectile.timeRemaining = 10; // 10 second timeout
    };

    /**
     * Creates an appropriate projectile.
     * @param numGenerations The number of generations on the field (field size used in directional calculations)
     * @returns {*} A projectile object.
     */
    Indexer_Animated.prototype.getProjectile = function(numGenerations){
        var self = this;

        switch(this.projectileOrientation)
        {
            case "upRight":
                if (self.canShootDownRight){
                    this.projectileOrientation = "downRight";
                }
                else if (self.canShootDownLeft){
                    this.projectileOrientation = "downLeft";
                }
                else if (self.canShootUpLeft){
                    this.projectileOrientation = "upLeft";
                }
                break;
            case "downRight":
                if (self.canShootDownLeft){
                    this.projectileOrientation = "downLeft";
                }
                else if (self.canShootUpLeft){
                    this.projectileOrientation = "upLeft";
                }
                else if (self.canShootUpRight){
                    this.projectileOrientation = "upRight";
                }
                break;
            case "downLeft":
                if (self.canShootUpLeft){
                    this.projectileOrientation = "upLeft";
                }
                else if (self.canShootUpRight){
                    this.projectileOrientation = "upRight";
                }
                else if (self.canShootDownRight){
                    this.projectileOrientation = "downRight";
                }
                break;
            case "upLeft":
                if (self.canShootUpRight)
                {
                    this.projectileOrientation = "upRight";
                }
                else if (self.canShootDownRight){
                    this.projectileOrientation = "downRight";
                }
                else if (self.canShootDownLeft){
                    this.projectileOrientation = "downLeft";
                }
                break;
        }
        var projectile = new Projectile();
        projectile.xCoord = this.xCoord + 5;
        projectile.yCoord = this.yCoord + 20;
        projectile.dmg = this.dmg;
        projectile.orientation = this.projectileOrientation;
        return projectile;
    };

    /**
     * Decreases the throwing cooldown - effectively increasing fire rate and animation speed.
     * @param ratio A ratio of how much to scale down by. 0.1 < x < 1 for speed up, 1 < x for slowdown. Values less than .1 become .1
     */
    Indexer_Animated.prototype.decreaseCooldown = function(ratio){
        ratio = (ratio < .1) ? .1 : ratio;
        this.throwDelay *= ratio;
        this.animation.dtAnim *= ratio;
        if(this.throwDelay < this.animation.safeIntervalTime()){
            console.log("Indexer_Animated Animation lasts longer than throw delay... Animations may interrupt each other")
        }
    };


    return Indexer_Animated;
});
