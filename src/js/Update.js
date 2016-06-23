define(['model/IAncestor'],function() {


    function Update()
    {
      this.wave = 0;
      this.timer = 0;
      this.secondsBetweenWaves = 5;
      this.spawnRecordTimer = 0;
      this.timeToNextRecordSpawn = 0;
      this.projectileSpeed = 80;

      this.doneSpawning = false;
      this.ancestorsDefeated = false;
    }

    Update.prototype.checkVictory = function(controller, activeAncestors)
    {
      //did you beat the level?
      if (this.doneSpawning && activeAncestors.length == 0)
      {
        controller.victory = true;
        controller.gameEnded = true;
      }
    }

    Update.prototype.checkDefeat = function(controller, activeAncestors)
    {
      for (var i = 0; i < activeAncestors.length; i++)
      {
        if (activeAncestors[i].xCoord <= 0)
        {
          controller.victory = false;
          controller.gameEnded = true;
        }
      }
    }

    //check if record ready to spawn
    Update.prototype.spawnRecord = function(activeRecords, timeElapsed)
    {

      this.spawnRecordTimer += timeElapsed;
      if (this.spawnRecordTimer > this.timeToNextRecordSpawn)
      {
        var collectableRecord = {
            xCoord: Math.random() * 1000,
            yCoord: -100,
            speed: 20,
            includesPoint: function(pt){
                return((pt.xCoord >= this.xCoord && pt.xCoord <= this.xCoord + 100)
                    && (pt.yCoord >= this.yCoord && pt.yCoord <= this.yCoord + 100));
            }
        };

        activeRecords.push(collectableRecord);

        //reset spawn timer
        this.spawnRecordTimer = 0;
        //time to next spawn is 5-11 seconds
        this.timeToNextRecordSpawn = Math.random() * 6 + 5;
      }
    };

    Update.prototype.moveRecords = function(activeRecords, timeElapsed)
    {
      for (var i = 0; i < activeRecords.length; i++)
      {
        activeRecords[i].yCoord += timeElapsed * activeRecords[i].speed;
      }
    };

    Update.prototype.moveProjectiles = function(activeProjectiles, timeElapsed)
    {
      for (var i = 0; i < activeProjectiles.length; i++)
      {
        activeProjectiles[i].xCoord += timeElapsed * this.projectileSpeed;
      }
    };

    Update.prototype.checkShootProjectile = function (activeIndexers, activeAncestors, activeProjectiles, timeElapsed)
    {
      var ancestorPopulatedLanes = [];
      for (var i = 0; i < activeAncestors.length; i++)
      {
        if (!ancestorPopulatedLanes.includes(activeAncestors[i].lane))
        {
          ancestorPopulatedLanes.push(parseInt(activeAncestors[i].lane));
        }
      }
      for (var i = 0; i < activeIndexers.length; i++)
      {

        //check if there are any ancestors in the same lane as the indexer
        if (ancestorPopulatedLanes.includes(activeIndexers[i].lane))
        {
          activeIndexers[i].throwTimer += timeElapsed;
          if (activeIndexers[i].throwTimer > activeIndexers[i].throwDelay)
          {
            activeIndexers[i].throwTimer = 0;
            var tempProjectile = activeIndexers[i].getProjectile();
            activeProjectiles.push(tempProjectile);
          }
        }
      }
    };

    Update.prototype.checkProjectileCollision = function(activeProjectiles, activeAncestors)
    {
      for (var i = 0; i < activeProjectiles.length; i++)
      {
        var keepChecking = true;
        for (var j = 0; j < activeAncestors.length; j++)
        {
          //check if collision has occured
          if (keepChecking && (activeProjectiles[i].xCoord + 14) >= activeAncestors[j].xCoord
        && activeProjectiles[i].lane == activeAncestors[j].lane && activeProjectiles[i].xCoord < (activeAncestors[j].xCoord + 40))
          {
            //deal damage
            activeAncestors[j].hp -= activeProjectiles[i].dmg;
            //remove projectile from gameOver
            activeProjectiles.splice(i, 1);
            i--;
            keepChecking = false;
          }
        }
      }
    };

    Update.prototype.checkDeadAncestors = function(activeAncestors)
    {
      for (var i = 0; i < activeAncestors.length; i++)
      {
        if (activeAncestors[i].hp <= 0)
        {
          activeAncestors.splice(i, 1);
          i--;
        }
      }
    };

    Update.prototype.checkAncestorSpawnTimes = function(level, activeAncestors, timeElapsed)
    {
      this.timer += timeElapsed;
      if (this.timer > this.secondsBetweenWaves)
      {
        this.wave++;
          this.timer = 0;
      }
      if (level[this.wave] != null)
      {
        for (var i = 0; i < level[this.wave].length; i++)
        {
          activeAncestors.push(level[this.wave][i]);
        }
        level[this.wave] = [];
      }
      if (!this.doneSpawning)
      {
        
        if (this.wave > level.length)
        {
          this.doneSpawning = true;
          console.log("done spawning");
        }
      }
    };

    Update.prototype.updateAncestorsPosition = function(activeAncestors, modifier)
    {
      for (var i = 0; i < activeAncestors.length; i++)
      {
        activeAncestors[i].xCoord -= modifier * activeAncestors[i].speed;
      }
    };


    Update.prototype.update = function(activeAncestors, activeIndexers, activeProjectiles, activeRecords, timeElapsed, level, controller)
    {
      this.updateAncestorsPosition(activeAncestors, timeElapsed);
      this.checkDeadAncestors(activeAncestors);
      this.checkAncestorSpawnTimes(level, activeAncestors, timeElapsed);

      this.spawnRecord(activeRecords, timeElapsed);
      this.moveRecords(activeRecords, timeElapsed);

      this.checkShootProjectile(activeIndexers, activeAncestors, activeProjectiles, timeElapsed);
      this.moveProjectiles(activeProjectiles, timeElapsed);
      this.checkProjectileCollision(activeProjectiles, activeAncestors);

      this.checkVictory(controller, activeAncestors);
      this.checkDefeat(controller, activeAncestors);
    };


    return Update;

});
