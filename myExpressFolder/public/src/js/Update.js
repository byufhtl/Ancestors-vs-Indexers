define(['model/IAncestor'],function() {


    function Update() {
        this.levelStartBuffer = 0;

        this.wave = 0;
        this.timer = 0;
        this.secondsBetweenWaves = 5;
        this.spawnRecordTimer = 0;
        this.timeToNextRecordSpawn = 0;
        this.projectileSpeed = 80;

        this.doneSpawning = false;
        this.ancestorsDefeated = false;
    }

    Update.prototype.checkVictory = function (controller, activeAncestors) {
        //did you beat the level?
        if (this.doneSpawning && activeAncestors.length == 0) {
            controller.victory = true;
            controller.gameEnded = true;
        }
    };

    Update.prototype.checkDefeat = function (controller, activeAncestors) {
        for (var i = 0; i < activeAncestors.length; i++) {
            if (activeAncestors[i].xCoord <= 0) {
                controller.victory = false;
                controller.gameEnded = true;
            }
        }
    };

    //check if record ready to spawn
    Update.prototype.spawnRecord = function (activeRecords, timeElapsed) {

        this.spawnRecordTimer += timeElapsed;
        if (this.spawnRecordTimer > this.timeToNextRecordSpawn) {
            var collectableRecord = {
                xCoord: Math.random() * 900,
                yCoord: -100,
                speed: 20,
                includesPoint: function (pt) {
                    return (pt.X <= this.xCoord + 50 && pt.X >= this.xCoord -50 && pt.Y < this.yCoord + 50 && pt.Y > this.yCoord -50);
                }
            };

            activeRecords.push(collectableRecord);

            //reset spawn timer
            this.spawnRecordTimer = 0;
            //time to next spawn is 5-11 seconds
            this.timeToNextRecordSpawn = Math.random() * 4 + 3;
        }
    };

    Update.prototype.moveRecords = function (activeRecords, timeElapsed) {
        for (var i = 0; i < activeRecords.length; i++) {
            activeRecords[i].yCoord += timeElapsed * activeRecords[i].speed;
        }
    };

    Update.prototype.moveProjectiles = function (activeProjectiles, timeElapsed) {
        for (var i = 0; i < activeProjectiles.length; i++) {
            var rec = activeProjectiles[i];
            rec.timeRemaining -= timeElapsed;
            if(rec.timeRemaining > 0) {
                if (rec.orientation == "upRight") {
                    rec.xCoord += timeElapsed * this.projectileSpeed;
                    rec.yCoord -= timeElapsed * this.projectileSpeed / 2;
                }
                else if (rec.orientation == "downRight") {
                    rec.xCoord += timeElapsed * this.projectileSpeed;
                    rec.yCoord += timeElapsed * this.projectileSpeed / 2;
                }
                else if (rec.orientation == "upLeft") {
                    rec.xCoord -= timeElapsed * this.projectileSpeed;
                    rec.yCoord -= timeElapsed * this.projectileSpeed / 2;
                }
                else if (rec.orientation == "downLeft") {
                    rec.xCoord -= timeElapsed * this.projectileSpeed;
                    rec.yCoord += timeElapsed * this.projectileSpeed / 2;
                }
            }
            else{
                activeProjectiles.splice(i--,1);
            }
        }
    };

    Update.prototype.checkShootProjectile = function (activeIndexers, activeAncestors, activeProjectiles, timeElapsed, levelStructure) {
        for (var i = 0; i < activeIndexers.length; i++) {
            activeIndexers[i].throwTimer += timeElapsed;
            if (activeIndexers[i].throwTimer > activeIndexers[i].throwDelay) {
                activeIndexers[i].throwTimer = 0;
                var tempProjectile = activeIndexers[i].getProjectile(levelStructure.length);
                tempProjectile.timeRemaining = 10; // 10 second timeout
                activeProjectiles.push(tempProjectile);
            }
        }
    };

    Update.prototype.checkProjectileCollision = function (activeProjectiles, activeAncestors) {
        for (var i = 0; i < activeAncestors.length; i++)
        {
            for (var j = 0; j < activeProjectiles.length; j++)
            {
                var distanceX = Math.abs(activeProjectiles[j].xCoord - activeAncestors[i].xCoord);
                var distanceY = Math.abs(activeProjectiles[j].yCoord - activeAncestors[i].yCoord);
                //check if within hitting distance
                if (distanceX < 20 && distanceY < 20)
                {
                    //deal damage to ancestor
                    activeAncestors[i].hp -= activeProjectiles[j].dmg;
                    //remove records
                    activeProjectiles.splice(j,1);
                    j--;
                }
            }
        }
    };

    Update.prototype.checkDeadAncestors = function (activeAncestors, defeatedAncestorInfo) {
        for (var i = 0; i < activeAncestors.length; i++) {
            if (activeAncestors[i].hp <= 0) {
                if (activeAncestors[i].type == "familyMember")
                {
                    defeatedAncestorInfo.push(activeAncestors[i].data);
                }
                activeAncestors.splice(i, 1);
                i--;
            }
        }
    };

    Update.prototype.checkAncestorSpawnTimes = function (level, activeAncestors, timeElapsed) {
        this.timer += timeElapsed;
        if (this.timer > this.secondsBetweenWaves) {
            this.wave++;
            this.timer = 0;
        }
        if (level[this.wave] != null) {
            for (var i = 0; i < level[this.wave].length; i++) {
                activeAncestors.push(level[this.wave][i]);
            }
            level[this.wave] = [];
        }
        if (!this.doneSpawning) {

            if (this.wave >= level.length - 1) {
                console.log("DONE SPAWNING");
                this.doneSpawning = true;
            }
        }
    };

    Update.prototype.updateAncestorsPosition = function (activeAncestors, modifier) {
        for (var i = 0; i < activeAncestors.length; i++) {
            //check whether to move up or down
            if (activeAncestors[i].distanceMovedX >= 300)
            {
                var numNodes = activeAncestors[i].currentGeneration + 1;
                var firstNodeY = - activeAncestors[i].currentGeneration * 150 + 300;
                //check if moving up is impossible
                if (Math.abs(firstNodeY - activeAncestors[i].yCoord) < 150)
                {
                     activeAncestors[i].upOrDown = "up";
                }
                //check if moving down is impossible
                else if (((firstNodeY + (numNodes - 1) * 300) - activeAncestors[i].yCoord) < 150)
                {
                      activeAncestors[i].upOrDown = "down";
                }
                else
                {
                    var random = Math.random();
                    if (random > 0.5)
                    {
                        activeAncestors[i].upOrDown = "up";
                    }
                    else
                    {
                        activeAncestors[i].upOrDown = "down";
                    }
                }
                activeAncestors[i].distanceMovedX = 0;
                activeAncestors[i].currentGeneration--;
            }
            //move ancestor diagonally according to speed
            activeAncestors[i].distanceMovedX += modifier * activeAncestors[i].speed;
            activeAncestors[i].xCoord -= modifier * activeAncestors[i].speed;
            if (activeAncestors[i].upOrDown == "up")
            {
                activeAncestors[i].yCoord += modifier * activeAncestors[i].speed / 2;
            }
            else if (activeAncestors[i].upOrDown == "down")
            {
                activeAncestors[i].yCoord -= modifier * activeAncestors[i].speed / 2;
            }

        }
    };


    Update.prototype.spawnRecordsFromBuildings = function (activeBuildings, activeRecords, timeElapsed) {
        for (var i = 0; i < activeBuildings.length; i++) {
            activeBuildings[i].spawnTimer += timeElapsed;
            if (activeBuildings[i].spawnTimer >= activeBuildings[i].timeBetweenSpawns) {
                activeBuildings[i].spawnTimer = 0;
                var collectableRecord = {
                    xCoord: activeBuildings[i].xCoord,
                    yCoord: activeBuildings[i].yCoord,
                    speed: 0,
                    includesPoint: function (pt) {
                      return (pt.X <= this.xCoord + 50 && pt.X >= this.xCoord -50 && pt.Y < this.yCoord + 50 && pt.Y > this.yCoord -50);
                    }
                }
                activeRecords.push(collectableRecord);

            }
        }
    };

    Update.prototype.buffer = function (timeElapsed) {
        this.levelStartBuffer += timeElapsed;
        if (this.levelStartBuffer > 20) {
            return true;
        }
        else return false;
    };


    Update.prototype.update = function (activeAncestors, activeIndexers, activeProjectiles, activeRecords, activeBuildings, timeElapsed, level, controller, levelStructure, defeatedAncestorInfo) {
        //spawn records and move them
        this.spawnRecord(activeRecords, timeElapsed);
        this.moveRecords(activeRecords, timeElapsed);
        this.spawnRecordsFromBuildings(activeBuildings, activeRecords, timeElapsed);

        if (this.buffer(timeElapsed)) {
            //update ancestors
            this.updateAncestorsPosition(activeAncestors, timeElapsed);
            this.checkDeadAncestors(activeAncestors, defeatedAncestorInfo);
            this.checkAncestorSpawnTimes(level, activeAncestors, timeElapsed);
            //update projectiles
            this.checkShootProjectile(activeIndexers, activeAncestors, activeProjectiles, timeElapsed, levelStructure);
            this.moveProjectiles(activeProjectiles, timeElapsed);
            this.checkProjectileCollision(activeProjectiles, activeAncestors);
            //check victory conditions
            this.checkVictory(controller, activeAncestors);
            this.checkDefeat(controller, activeAncestors);
        }
    };

    return Update;

});
