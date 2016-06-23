define([],function() {


    function Render(canvas)
    {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      console.log(this.canvas);
      this.bgReady = false;
      this.bgImage = new Image();
      var self = this
      this.bgImage.onload = function () {
      	self.bgReady = true;
      };
      this.bgImage.src = "src/img/background.png";

      this.indexerImgReady = false;
      this.indexerImg = new Image();
      this.indexerImg.onload = function() {
        self.indexerImgReady = true;
      };
      this.indexerImg.src = "src/img/ancestors/peasant.png";


      this.recordImgReady = false;
      this.recordImg = new Image();
      this.recordImg.onload = function() {
        self.recordImgReady = true;
      }
      this.recordImg.src = "src/img/records/goldenRecord.png";

      this.lightbeamImgReady = false;
      this.lightbeamImg = new Image();
      this.lightbeamImg.onload = function() {
        self.lightbeamImgReady = true;
      }
      this.lightbeamImg.src = "src/img/lightbeam.png";
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
        if (this.indexerImgReady)
        {
          for (var i = 0; i < activeAncestors.length; i++)
          {
            this.ctx.drawImage(this.indexerImg, activeAncestors[i].xCoord, activeAncestors[i].yCoord);
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
    }
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

    Render.prototype.renderBuildings = function(activeBuildings)
    {

    };

    Render.prototype.render = function(activeAncestors, activeIndexers, activeRecords, activeBuildings)
    {
      this.renderBackground();
      this.renderAncestors(activeAncestors);
      this.renderIndexers(activeIndexers);
      this.renderBuildings(activeBuildings);
      this.renderRecords(activeRecords);
      //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderLightBeam();
    };


    return Render;

});
