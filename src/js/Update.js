define(['model/IAncestor'],function() {


    function Update()
    {
      this.wave = 0;
      this.timer = 0;
      this.secondsBetweenWaves = 5;
      this.spawnRecordTimer = 0;
      this.timeToNextRecordSpawn = 0;
    }

    //check if record ready to spawn
    Update.prototype.spawnRecord = function(activeRecords, timeElapsed)
    {

      this.spawnRecordTimer += timeElapsed;
      if (this.spawnRecordTimer > this.timeToNextRecordSpawn)
      {
        console.log("spawning a record");
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
    }

    Update.prototype.moveRecords = function(activeRecords, timeElapsed)
    {
      for (var i = 0; i < activeRecords.length; i++)
      {
        activeRecords[i].yCoord += timeElapsed * activeRecords[i].speed;
      }
    }

    Update.prototype.checkAncestorSpawnTimes = function(level, activeAncestors, timeElapsed)
    {
      this.timer += timeElapsed;
      if (this.timer > this.secondsBetweenWaves)
      {
        this.wave++;
      }
      if (level[this.wave] != null)
      {
        for (var i = 0; i < level[this.wave].length; i++)
        {
          activeAncestors.push(level[this.wave][i]);
        }
        level[this.wave] = [];
      }
    };

    Update.prototype.updateAncestorsPosition = function(activeAncestors, modifier)
    {
      for (var i = 0; i < activeAncestors.length; i++)
      {
        activeAncestors[i].xCoord -= modifier * activeAncestors[i].speed;

      }
    };


    Update.prototype.update = function(activeAncestors, activeIndexers, activeRecords, timeElapsed, level)
    {
      this.updateAncestorsPosition(activeAncestors, timeElapsed);
      this.checkAncestorSpawnTimes(level, activeAncestors, timeElapsed);
      this.spawnRecord(activeRecords, timeElapsed);
      this.moveRecords(activeRecords, timeElapsed);
    };


    return Update;

});
