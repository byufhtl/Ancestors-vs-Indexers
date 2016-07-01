define([],function() {


    function Render(canvas, ImageManager, ViewTransform)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.imageManager = ImageManager;

        this.viewTransform = ViewTransform;
        console.log("Renderer. Got view transform", this.viewTransform);
        //offsets for different images, since they render from the corner of the image. These are based on image size/2
        this.ancestorXBuffer = -36;
        this.ancestorYBuffer = -50;

        this.indexerXBuffer = -36;
        this.indexerYBuffer = -50;

        this.nodeOffset = -25;

        this.projectileXOffset = -33;
        this.projectileYOffset = -50;

        this.standardBuildingXOffset = -72/2;
        this.standardBuildingYOffset = -110/2;

        this.recordOffset = -50;
        this.resizeOnce = true;

        this.treeWidth = 2400;
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
        this.ctx.drawImage(bgImg, -this.viewTransform.t_offset_X, -this.viewTransform.t_offset_Y, bgImg.width, bgImg.height, 0, 0, this.canvas.width, this.canvas.height);
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
            this.ctx.drawImage(ancImg, activeAncestors[i].xCoord + this.viewTransform.t_offset_X + this.ancestorXBuffer, activeAncestors[i].yCoord + this.viewTransform.t_offset_Y + this.ancestorYBuffer);
        }
    };

    Render.prototype.renderRecords = function(activeRecords)
    {
        var recGoldImg = this.imageManager.getImage(this.imageManager.REC_GD);
        for (var i = 0; i < activeRecords.length; i++)
        {
            this.ctx.drawImage(recGoldImg, activeRecords[i].xCoord + this.recordOffset, activeRecords[i].yCoord + this.recordOffset);
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
                case "uber":
                    indexerImg = this.imageManager.getImage(this.imageManager.UBER_IDX);
                    break;
                // More cases to be installed as we get more coded up.
                default:
                    indexerImg = this.imageManager.getImage(this.imageManager.STAN_IDX);
            }
            this.ctx.drawImage(indexerImg, activeIndexers[i].xCoord + this.viewTransform.t_offset_X + this.indexerXBuffer, activeIndexers[i].yCoord + this.viewTransform.t_offset_Y + this.indexerYBuffer);
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
                case "uber":
                    recordImg = this.imageManager.getImage(this.imageManager.REC_GR);
                    break;
                default:
                    recordImg = this.imageManager.getImage(this.imageManager.REC_BR);
            }
            this.ctx.drawImage(recordImg, activeProjectiles[i].xCoord + this.viewTransform.t_offset_X + this.projectileXOffset, activeProjectiles[i].yCoord + this.viewTransform.t_offset_Y + this.projectileYOffset, recordImg.width / 3, recordImg.height / 3);
        }
    };

    Render.prototype.renderBuildings = function(activeBuildings)
    {
        var buildingImg = this.imageManager.getImage(this.imageManager.BLD_FHCR);
        for (var i = 0; i < activeBuildings.length; i++) {
            switch (activeBuildings[i].type) {
                case "library":
                    buildingImg = this.imageManager.getImage(this.imageManager.BLD_LIBR);
                    break;
                default:
                    buildingImg = this.imageManager.getImage(this.imageManager.BLD_FHCR);
            }
            this.ctx.drawImage(buildingImg, activeBuildings[i].xCoord + this.viewTransform.t_offset_X + this.standardBuildingXOffset, activeBuildings[i].yCoord + this.viewTransform.t_offset_Y + this.standardBuildingYOffset);
            //console.log("drawing building: " + i + " x: " + activeBuildings[i].xCoord + this.viewTransform.t_offset_X + " y: " + activeBuildings[i].yCoord + this.viewTransform.t_offset_Y);
        }
    };


    Render.prototype.renderTriangularPlayingField = function(levelStructure)
    {
        var alphaImg = this.imageManager.getImage(this.imageManager.TRI_A);

        var betaImg = this.imageManager.getImage(this.imageManager.TRI_B);
          for (var i = 0; i < levelStructure.length; i++)
          {
              for (var j = 0; j < levelStructure[i].length; j++)
              {
                  if (levelStructure[i][j].type == "alpha")
                  {
                      this.ctx.drawImage(alphaImg, levelStructure[i][i].xCoord + this.viewTransform.t_offset_X, levelStructure[i][j].yCoord + this.viewTransform.t_offset_Y);
                  }
                  else
                  {
                      this.ctx.drawImage(betaImg, levelStructure[i][i].xCoord + this.viewTransform.t_offset_X, levelStructure[i][j].yCoord + this.viewTransform.t_offset_Y);
                  }
              }
          }
    };

    Render.prototype.renderNodeStructure = function(nodeStructure)
    {
        //get node image here
        var nodeImg = this.imageManager.getImage(this.imageManager.NODE);
        for (var i = 0; i < nodeStructure.length; i++)
        {
            for (var j = 0; j < nodeStructure[i].length; j++)
            {
                if (!nodeStructure[i][j].occupied)
                {
                    //draw node here
                    this.ctx.drawImage(nodeImg, nodeStructure[i][j].xCoord + this.viewTransform.t_offset_X + this.nodeOffset, nodeStructure[i][j].yCoord + this.viewTransform.t_offset_Y + this.nodeOffset);
                }
            }
        }
    };

    Render.prototype.renderTree = function(levelStructure)
    {
        var tree = this.imageManager.getImage(this.imageManager.UND_TREE);
        /*
        if (this.resizeOnce)
        {
          var numGenerations = levelStructure.length;
          console.log("numGenerations: " + numGenerations);
          tree.width = Math.floor(this.treeWidth/8) * numGenerations;
          this.resizeOnce = false;
          console.log(tree.width);
        }
        */
        this.ctx.drawImage(tree, 0, 0, tree.width/8 * levelStructure.length, tree.height, 0 + this.viewTransform.t_offset_X, -900 + this.viewTransform.t_offset_Y, tree.width/8 * levelStructure.length, tree.height);
    }

    Render.prototype.reset = function()
    {
      this.resizeOnce = true;
    }

    Render.prototype.render = function(activeAncestors, activeIndexers, activeProjectiles, activeRecords, activeBuildings, canvas, translation, levelStructure, nodeStructure) {
        //console.log("Render Offsets:", this.xOffset, this.viewTransform.t_offset_Y, translation, translation.dx, translation.dy);
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        //this.renderBackground();
        this.renderTree(levelStructure);
        this.renderTriangularPlayingField(levelStructure);
        this.renderNodeStructure(nodeStructure);
        this.renderIndexers(activeIndexers);
        this.renderBuildings(activeBuildings);
        this.renderAncestors(activeAncestors);
        this.renderBuildings(activeBuildings);
        this.renderProjectiles(activeProjectiles);
        this.renderRecords(activeRecords);
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //this.renderLightBeam();

    };


    return Render;

});
