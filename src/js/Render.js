define(['model/IAncestor'],function() {


    function Render(canvas)
    {
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
      };
      this.recordImg.src = "src/img/record.png";
    }


    Render.prototype.renderBackground = function()
    {
        if (this.bgReady)
        {
          this.ctx.drawImage(this.bgImage, 0, 0, this.bgImage.width, this.bgImage.height, 0, 0, this.canvas.width, this.canvas.height);
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

    Render.prototype.renderIndexers = function(activeIndexers)
    {

    };

    Render.prototype.renderBuildings = function(activeBuildings)
    {

    };

    Render.prototype.render = function(activeAncestors, activeIndexers, activeBuildings)
    {
      this.renderBackground();
      this.renderAncestors(activeAncestors);
      this.renderIndexers(activeIndexers);
      this.renderBuildings(activeBuildings);
      //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };


    return Render;

});
