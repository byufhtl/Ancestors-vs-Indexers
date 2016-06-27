define([],function() {


    function Render(canvas, ImageManager)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.imageManager = ImageManager;
    }

    Render.prototype.renderVictory = function()
    {
        var victoryImg = this.imageManager.getImage(this.imageManager.VCTR);
        this.ctx.drawImage(victoryImg, 0, 0, victoryImg.width, victoryImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderDefeat = function()
    {
        var defeatImg = this.imageManager.getImage(this.imageManager.DFET);
        this.ctx.drawImage(defeatImg, 0, 0, defeatImg.width, defeatImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderBackground = function()
    {
        var bgImg = this.imageManager.getImage(this.imageManager.BKGD);
        this.ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderLightBeam = function()
    {
        var fgImg = this.imageManager.getImage(this.imageManager.FRGD);
        this.ctx.drawImage(fgImg, 0, 0, fgImg.width, fgImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderAncestors = function(activeAncestors)
    {
        var ancStanImg = this.imageManager.getImage(this.imageManager.ANC_STAN);
        for (var i = 0; i < activeAncestors.length; i++)
        {
            this.ctx.drawImage(ancStanImg, activeAncestors[i].xCoord, activeAncestors[i].yCoord);
        }
    };

    Render.prototype.renderRecords = function(activeRecords)
    {
        var recGoldImg = this.imageManager.getImage(this.imageManager.REC_GD);
        for (var i = 0; i < activeRecords.length; i++)
        {
            this.ctx.drawImage(recGoldImg, activeRecords[i].xCoord, activeRecords[i].yCoord);
        }
    };

    Render.prototype.renderIndexers = function(activeIndexers)
    {
        var indexerImg = this.imageManager.getImage(this.imageManager.IDX_STAN);
        for (var i = 0; i < activeIndexers.length; i++)
        {
            switch(activeIndexers[i].type){
                case "hobbyist":
                    indexerImg = this.imageManager.getImage(this.imageManager.IDX_HOBB);
                    break;
                // More cases to be installed as we get more coded up.
                default:
                    indexerImg = this.imageManager.getImage(this.imageManager.IDX_STAN);
            }
            this.ctx.drawImage(indexerImg, activeIndexers[i].xCoord, activeIndexers[i].yCoord);
        }
    };

    Render.prototype.renderProjectiles = function(activeProjectiles)
    {
        var recordImg = this.imageManager.getImage(this.imageManager.REC_BR);
        for (var i = 0; i < activeProjectiles.length; i++) {
            switch (activeProjectiles[i].type) {
                case "strong":
                    recordImg = this.imageManager.getImage(this.imageManager.REC_GD);
                    break;
                default:
                    recordImg = this.imageManager.getImage(this.imageManager.REC_BR);
            }
            this.ctx.drawImage(recordImg, activeProjectiles[i].xCoord, activeProjectiles[i].yCoord, recordImg.width / 3, recordImg.height / 3);
        }
    };

    Render.prototype.renderBuildings = function(activeBuildings)
    {
        var buildingImg = this.imageManager.getImage(this.imageManager.BLD_FHCR);
        for (var i = 0; i < activeBuildings.length; i++) {
            console.log("rendering Buildings");
            switch (activeBuildings[i].type) {
                case "hobbyistBuilding":
                    buildingImg = this.imageManager.getImage(this.imageManager.BLD_LIBR);
                    break;
                default:
                    buildingImg = this.imageManager.getImage(this.imageManager.BLD_FHCR);
            }
            this.ctx.drawImage(buildingImg, activeBuildings[i].xCoord, activeBuildings[i].yCoord);
        }
    };

    Render.prototype.render = function(activeAncestors, activeIndexers, activeProjectiles, activeRecords, activeBuildings)
    {
      this.renderBackground();
      this.renderIndexers(activeIndexers);
      this.renderBuildings(activeBuildings);
      this.renderAncestors(activeAncestors);
      this.renderBuildings(activeBuildings);
      this.renderProjectiles(activeProjectiles);
      this.renderRecords(activeRecords);
      //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderLightBeam();
    };


    return Render;

});
