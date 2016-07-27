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

    Update.prototype.checkVictory = function (active) {
        //did you beat the level?
        if (this.doneSpawning && active.ancestors().length == 0) {
            console.log('victory');
            console.log('i guess we won and active.ancestors is: ', active.ancestors);
            active.vtry = true;
            active.ended = true;
        }
    };

    Update.prototype.checkDefeat = function (active) {
        for (var i = 0; i < active.ancestors().length; i++) {
            if (active.ancestors()[i].xCoord <= 0) {
                active.vtry = false;
                active.ended = true;
                console.log('defeat');
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



    Update.prototype.checkProjectileCollision = function (activeProjectiles, activeAncestors) {

        for (var i = 0; i < activeAncestors.length; i++)
        {
            for (var j = 0; j < activeProjectiles.length; j++)
            {
                var distanceX = Math.abs(activeProjectiles[j].xCoord - (activeAncestors[i].xCoord));
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
                if (activeAncestors[i].type == "familyMember" && activeAncestors[i].name != 'joe')
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
                console.log("adding an ancestor", activeAncestors);
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

    Update.prototype.updateIndexers = function(activeIndexers, activeAncestors, timeElapsed, activeProjectiles, levelStructure)
    {

        for (var i = 0; i < activeIndexers.length; i++)
        {
            activeIndexers[i].update(activeAncestors, timeElapsed, activeProjectiles, levelStructure);
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


    Update.prototype.spawnRecordsFromBuildings = function (activeBuildings, activeRecords, timeElapsed, points) {
        for (var i = 0; i < activeBuildings.length; i++) {
            activeBuildings[i].spawnTimer += timeElapsed;
            if (activeBuildings[i].spawnTimer >= activeBuildings[i].timeBetweenSpawns) {
                activeBuildings[i].spawnTimer = 0;
                gameController.resourcePoints += 10;
                $('#points').html(gameController.points);
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

    Update.prototype.moveAnimFrames = function(activeAncestors, timeElapsed)
    {
        for (var i = 0; i < activeAncestors.length; i++)
        {

            activeAncestors[i].animTimer += timeElapsed;
            if (activeAncestors[i].animTimer > activeAncestors[i].timeBetweenFrames)
            {
                activeAncestors[i].animTimer = 0;
                activeAncestors[i].animFrame++;
                if (activeAncestors[i].animFrame >= (activeAncestors[i].numFrames - 1)) activeAncestors[i].animFrame = 0;
            }
        }
    };

    Update.prototype.update = function (active, timeElapsed, level, levelStructure, defeatedAncestorInfo) {
        //spawn records and move them
        this.spawnRecord(active.records(), timeElapsed);
        this.moveRecords(active.records(), timeElapsed);
        this.spawnRecordsFromBuildings(active.buildings(), active.records(), timeElapsed, active.points());

        if (this.buffer(timeElapsed)) {
            //update indexers
            this.updateIndexers(active.indexers(), active.ancestors(), timeElapsed, active.projectiles(), levelStructure);
            //update ancestors
            this.updateAncestorsPosition(active.ancestors(), timeElapsed);
            this.checkDeadAncestors(active.ancestors(), defeatedAncestorInfo);
            this.checkAncestorSpawnTimes(level, active.ancestors(), timeElapsed);
            //update projectiles
            this.moveProjectiles(active.projectiles(), timeElapsed);
            this.checkProjectileCollision(active.projectiles(), active.ancestors());
            //check victory conditions
            this.checkVictory(active);
            this.checkDefeat(active);

            this.moveAnimFrames(active.ancestors(), timeElapsed);

        }
    };

    return Update;

});
