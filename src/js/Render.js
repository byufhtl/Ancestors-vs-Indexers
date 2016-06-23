define([],function() {


    function Render(canvas)
    {
        console.log(canvas);
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      console.log(this.canvas);
      this.bgReady = false;
      this.bgImage = new Image();
      var self = this;
      this.bgImage.onload = function () {
      	self.bgReady = true;
      };
      this.bgImage.src = "src/img/background.png";

      this.ancestorImgReady = false;
      this.ancestorImg = new Image();
      this.ancestorImg.onload = function() {
        self.ancestorImgReady = true;
      };
      this.ancestorImg.src = "src/img/ancestors/peasant.png";

        this.indexerImgReady = false;
        this.indexerImg = new Image();
        this.indexerImg.onload = function() {
            self.indexerImgReady = true;
        };
        this.indexerImg.src = "src/img/indexers/bow-indexer.png";

      this.recordImgReady = false;
      this.recordImg = new Image();
      this.recordImg.onload = function() {
        self.recordImgReady = true;
      };
      this.recordImg.src = "src/img/records/goldenRecord.png";

      this.lightbeamImgReady = false;
      this.lightbeamImg = new Image();
      this.lightbeamImg.onload = function() {
        self.lightbeamImgReady = true;
      };
      this.lightbeamImg.src = "src/img/lightbeam.png";

      this.victoryImgReady = false;
      this.victoryImg = new Image();
      this.victoryImg.onload = function() {
        self.victoryImgReady = true;
      };
      this.victoryImg.src = "src/img/victory.jpg";

      this.deafeatImgReady = false;
      this.defeatImg = new Image();
      this.defeatImg.onload = function() {
        self.defeatImgReady = true;
      };
      this.defeatImg.src = "src/img/defeat.jpg";

      this.standardProjectileImgReady = false;
      this.standProjectileImg = new Image();
      this.standProjectileImg.onload = function() {
        self.standardProjectileImgReady = true;
      };
      this.standProjectileImg.src = "src/img/records/brownRecord.png";
    }

    Render.prototype.renderVictory = function()
    {
          this.ctx.drawImage(this.victoryImg, 0, 0, this.victoryImg.width, this.victoryImg.height, 0, 0, this.canvas.width, this.canvas.height);
    }

    Render.prototype.renderDefeat = function()
    {
          this.ctx.drawImage(this.defeatImg, 0, 0, this.defeatImg.width, this.defeatImg.height, 0, 0, this.canvas.width, this.canvas.height);
    }
    Render.prototype.renderBackground = function()
    {
        if (this.bgReady)
        {
          this.ctx.drawImage(this.bgImage, 0, 0, this.bgImage.width, this.bgImage.height, 0, 0, this.canvas.width, this.canvas.height);
        }
    };

    Render.prototype.renderLightBeam = function()
    {
      if (this.lightbeamImgReady)
      {
        this.ctx.drawImage(this.lightbeamImg, 0, 0, this.lightbeamImg.width, this.lightbeamImg.height, 0, 0, this.canvas.width, this.canvas.height);
      }
    };

    Render.prototype.renderAncestors = function(activeAncestors)
    {
      var self = this;
        if (this.ancestorImgReady)
        {
          for (var i = 0; i < activeAncestors.length; i++)
          {
            this.ctx.drawImage(this.ancestorImg, activeAncestors[i].xCoord, activeAncestors[i].yCoord);
          }
        }
    };

    Render.prototype.renderRecords = function(activeRecords)
    {

      var self = this;
        if (this.recordImgReady)
        {
          for (var i = 0; i < activeRecords.length; i++)
          {
            this.ctx.drawImage(this.recordImg, activeRecords[i].xCoord, activeRecords[i].yCoord);
          }
        }
    };
    Render.prototype.renderIndexers = function(activeIndexers)
    {
      var self = this;
        if (this.indexerImgReady)
        {
          for (var i = 0; i < activeIndexers.length; i++)
          {
            this.ctx.drawImage(this.indexerImg, activeIndexers[i].xCoord, activeIndexers[i].yCoord);
          }
        }
    };

    Render.prototype.renderProjectiles = function(activeProjectiles)
    {
      var self = this;
        if (this.standardProjectileImgReady)
        {
          for (var i = 0; i < activeProjectiles.length; i++)
          {
            this.ctx.drawImage(this.standProjectileImg, activeProjectiles[i].xCoord, activeProjectiles[i].yCoord, this.standProjectileImg.width/3, this.standProjectileImg.height/3);
          }
        }
    }
    Render.prototype.renderBuildings = function(activeBuildings)
    {

    };

    Render.prototype.render = function(activeAncestors, activeIndexers, activeProjectiles, activeRecords, activeBuildings)
    {
      this.renderBackground();
      this.renderIndexers(activeIndexers);
      this.renderAncestors(activeAncestors);
      this.renderBuildings(activeBuildings);
      this.renderProjectiles(activeProjectiles);
      this.renderRecords(activeRecords);
      //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderLightBeam();
    };


    return Render;

});
