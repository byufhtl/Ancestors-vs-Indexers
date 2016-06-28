define([],function() {


    function Render(canvas, ImageManager)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.xOffset = 0;
        this.yOffset = 0;
        console.log("Starting Coordinates:", this.xOffset, this.yOffset);
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
        this.ctx.drawImage(bgImg, -this.xOffset, -this.yOffset, bgImg.width, bgImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderLightBeam = function()
    {
        var fgImg = this.imageManager.getImage(this.imageManager.FRGD);
        this.ctx.drawImage(fgImg, 0, 0, fgImg.width, fgImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderAncestors = function(activeAncestors)
    {
        var ancImg = this.imageManager.getImage(this.imageManager.ANC_STAN);
        for (var i = 0; i < activeAncestors.length; i++)
        {
            switch(activeAncestors[i].type){
                case "nameless":
                    ancImg = this.imageManager.getImage(this.imageManager.ANC_NMLS);
                    break;
                default:
                    ancImg = this.imageManager.getImage(this.imageManager.ANC_STAN);
            }
            this.ctx.drawImage(ancImg, activeAncestors[i].xCoord + this.xOffset, activeAncestors[i].yCoord + this.yOffset);
        }
    };

    Render.prototype.renderRecords = function(activeRecords)
    {
        var recGoldImg = this.imageManager.getImage(this.imageManager.REC_GD);
        for (var i = 0; i < activeRecords.length; i++)
        {
            this.ctx.drawImage(recGoldImg, activeRecords[i].xCoord + this.xOffset, activeRecords[i].yCoord + this.yOffset);
        }
    };

    Render.prototype.renderIndexers = function(activeIndexers)
    {
        var indexerImg = this.imageManager.getImage(this.imageManager.STAN_IDX);
        for (var i = 0; i < activeIndexers.length; i++)
        {
            switch(activeIndexers[i].type){
                case "hobbyist":
                    indexerImg = this.imageManager.getImage(this.imageManager.HOBB_IDX);
                    break;
                // More cases to be installed as we get more coded up.
                default:
                    indexerImg = this.imageManager.getImage(this.imageManager.STAN_IDX);
            }
            this.ctx.drawImage(indexerImg, activeIndexers[i].xCoord + this.xOffset, activeIndexers[i].yCoord + this.yOffset);
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
            this.ctx.drawImage(recordImg, activeProjectiles[i].xCoord + this.xOffset, activeProjectiles[i].yCoord + this.yOffset, recordImg.width / 3, recordImg.height / 3);
        }
    };

    Render.prototype.renderBuildings = function(activeBuildings)
    {
        var buildingImg = this.imageManager.getImage(this.imageManager.BLD_FHCR);
        for (var i = 0; i < activeBuildings.length; i++) {
            console.log("rendering Buildings");
            switch (activeBuildings[i].type) {
                case "library":
                    buildingImg = this.imageManager.getImage(this.imageManager.BLD_LIBR);
                    break;
                default:
                    buildingImg = this.imageManager.getImage(this.imageManager.BLD_FHCR);
            }
            this.ctx.drawImage(buildingImg, activeBuildings[i].xCoord + this.xOffset, activeBuildings[i].yCoord + this.yOffset);
        }
    };


    Render.prototype.renderTriangularPlayingField = function(levelStructure)
    {

      var alphaImg = this.imageManager.getImage(this.imageManager.TRI_A);
      var betaImg = this.imageManager.getImage(this.imageManager.TRI_B);
      console.log(levelStructure);
        for (var i = 0; i < levelStructure.length; i++)
        {
            for (var j = 0; j < levelStructure[i].length; j++)
            {
                if (levelStructure[i][j].type == "alpha")
                {
                    this.ctx.drawImage(alphaImg, levelStructure[i][i].xCoord, levelStructure[i][j].yCoord);
                }
                else
                {
                    this.ctx.drawImage(betaImg, levelStructure[i][i].xCoord, levelStructure[i][j].yCoord);
                }
            }
        }
    };


    Render.prototype.render = function(activeAncestors, activeIndexers, activeProjectiles, activeRecords, activeBuildings, canvas, translation, levelStructure) {
        //console.log("Render Offsets:", this.xOffset, this.yOffset, translation, translation.dx, translation.dy);
        this.xOffset += parseInt(translation.dx, 10);
        this.yOffset += parseInt(translation.dy, 10);
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.renderBackground();
        this.renderIndexers(activeIndexers);
        this.renderBuildings(activeBuildings);
        this.renderAncestors(activeAncestors);
        this.renderBuildings(activeBuildings);
        this.renderProjectiles(activeProjectiles);
        this.renderRecords(activeRecords);
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderLightBeam();
        //this.renderTriangularPlayingField(levelStructure);

    };


    return Render;

});
