define(['img/ImageManager'],function(ImageManager) {


    function Render(canvas, ViewTransform, imageManager)
    {
        this.imageManager = imageManager;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.viewTransform = ViewTransform;
        //offsets for different images, since they render from the corner of the image. These are based on image size/2
        this.ancestorXBuffer = -36;
        this.ancestorYBuffer = -70;

        this.indexerXBuffer = -38;
        this.indexerYBuffer = -73;

        this.nodeOffset = -25;

        this.projectileXOffset = -33;
        this.projectileYOffset = -65;

        this.standardBuildingXOffset = -72/2;
        this.standardBuildingYOffset = -110/2;

        this.recordOffset = -50;
        this.resizeOnce = true;

        this.treeWidth = 2400;
    }

    Render.prototype.renderVictory = function()
    {
        var victoryImg = this.imageManager.getImage(ImageManager.GM_VCTRY);
        this.ctx.drawImage(victoryImg, 0, 0, victoryImg.width, victoryImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderDefeat = function()
    {
        var defeatImg = this.imageManager.getImage(ImageManager.GM_DFEAT);
        this.ctx.drawImage(defeatImg, 0, 0, defeatImg.width, defeatImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderBackground = function()
    {
        var bgImg = this.imageManager.getImage(ImageManager.BKGD_IMG);
        // console.log("W/H:", bgImg.width, bgImg.height);
        this.ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, 0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.drawImage(bgImg, (bgImg.width+this.viewTransform.t_offset_X/2)/4, (bgImg.height+this.viewTransform.t_offset_Y/2)/4, bgImg.width, bgImg.height, 0, 0, bgImg.width, bgImg.height); //, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderLightBeam = function()
    {
        var fgImg = this.imageManager.getImage(ImageManager.GM_FRGRD);
        this.ctx.drawImage(fgImg, 0, 0, fgImg.width, fgImg.height, 0, 0, this.canvas.width, this.canvas.height);
    };


    Render.prototype.renderFamilyMemberName = function(activeAncestors, i)
    {
        this.ctx.font = "10px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(activeAncestors[i].name, activeAncestors[i].xCoord + this.viewTransform.t_offset_X + this.ancestorXBuffer, activeAncestors[i].yCoord + this.viewTransform.t_offset_Y + this.ancestorYBuffer);
        this.ctx.fillStyle = "black";
    };

    Render.prototype.renderAncestors = function(activeAncestors)
    {
        var ancImg = this.imageManager.getImage(ImageManager.ANC_STAN);
        for (var i = 0; i < activeAncestors.length; i++)
        {
            switch(activeAncestors[i].type){
                case "familyMember":
                    // ancImg = this.imageManager.getImage(ImageManager.ANC_NMLS);
                    this.renderFamilyMemberName(activeAncestors, i);
                    // this.ctx.drawImage(ancImg, activeAncestors[i].animFrame * 50,0,50,50,activeAncestors[i].xCoord + this.viewTransform.t_offset_X + this.ancestorXBuffer,activeAncestors[i].yCoord + this.viewTransform.t_offset_Y + this.ancestorYBuffer,80,80);
                    // break;
                case "nameless":
                    ancImg = this.imageManager.getImage(ImageManager.ANC_NMLS);
                    // this.ctx.drawImage(ancImg, activeAncestors[i].xCoord + this.viewTransform.t_offset_X + this.ancestorXBuffer, activeAncestors[i].yCoord + this.viewTransform.t_offset_Y + this.ancestorYBuffer);
                    this.ctx.drawImage(ancImg, activeAncestors[i].animFrame * 50,0,50,50,activeAncestors[i].xCoord + this.viewTransform.t_offset_X + this.ancestorXBuffer,activeAncestors[i].yCoord + this.viewTransform.t_offset_Y + this.ancestorYBuffer,80,80);
                    break;
                default:
                    ancImg = this.imageManager.getImage(ImageManager.ANC_STAN);
                    this.ctx.drawImage(ancImg, activeAncestors[i].animFrame * 50,0,50,50,activeAncestors[i].xCoord + this.viewTransform.t_offset_X + this.ancestorXBuffer,activeAncestors[i].yCoord + this.viewTransform.t_offset_Y + this.ancestorYBuffer,80,80);
            }
        }
    };


    Render.prototype.renderRecords = function(activeRecords)
    {
        var recGoldImg = this.imageManager.getImage(ImageManager.REC_GOLD);
        for (var i = 0; i < activeRecords.length; i++)
        {
            this.ctx.drawImage(recGoldImg, activeRecords[i].xCoord + this.recordOffset, activeRecords[i].yCoord + this.recordOffset);
        }
    };


    Render.prototype.drawSpecialist = function(activeIndexers, i)
    {
        homeBaseImg = this.imageManager.getImage(ImageManager.DESK_LRG);
        this.ctx.drawImage(homeBaseImg, activeIndexers[i].homeXCoord + this.viewTransform.t_offset_X + this.indexerXBuffer, activeIndexers[i].homeYCoord + this.viewTransform.t_offset_Y + this.indexerYBuffer);

        //draw numbers on base and above the specialist
        this.ctx.font = "10px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(activeIndexers[i].recordsOnHand, activeIndexers[i].xCoord + this.viewTransform.t_offset_X + this.indexerXBuffer + 20, activeIndexers[i].yCoord + this.viewTransform.t_offset_Y + 20 + this.indexerYBuffer);
        this.ctx.fillText(activeIndexers[i].recordsCharged, activeIndexers[i].homeXCoord + this.viewTransform.t_offset_X + this.indexerXBuffer, activeIndexers[i].homeYCoord + this.viewTransform.t_offset_Y + this.indexerYBuffer);
        this.ctx.fillStyle = "black";
    };

    Render.prototype.renderIndexers = function(activeIndexers)
    {
        var indexerImg = this.imageManager.getImage(ImageManager.STAN_IDX);
        for (var i = 0; i < activeIndexers.length; i++)
        {
            // console.log("Animating Indexer of type:", activeIndexers[i].type, "(" + i + "/" + activeIndexers.length + ")");
            switch(activeIndexers[i].type){
                case "hobbyist":
                    indexerImg = this.imageManager.getImage(ImageManager.HOBB_IDX);
                    this.ctx.drawImage(indexerImg, activeIndexers[i].xCoord + this.viewTransform.t_offset_X + this.indexerXBuffer, activeIndexers[i].yCoord + this.viewTransform.t_offset_Y + this.indexerYBuffer);
                    break;
                case "uber":
                    indexerImg = this.imageManager.getImage(ImageManager.UBER_IDX);
                    this.ctx.drawImage(indexerImg, activeIndexers[i].xCoord + this.viewTransform.t_offset_X + this.indexerXBuffer, activeIndexers[i].yCoord + this.viewTransform.t_offset_Y + this.indexerYBuffer);
                    break;
                case "specialist":
                    indexerImg = this.imageManager.getImage(ImageManager.HOBB_IDX);
                    this.ctx.drawImage(indexerImg, activeIndexers[i].xCoord + this.viewTransform.t_offset_X + this.indexerXBuffer, activeIndexers[i].yCoord + this.viewTransform.t_offset_Y + this.indexerYBuffer);
                    if (activeIndexers[i].type == "specialist") {
                        this.drawSpecialist(activeIndexers, i);
                    }
                    break;
                // More cases to be installed as we get more coded up.
                default:
                    indexerImg = this.imageManager.getImage(ImageManager.STAN_IDX);
                    var location = activeIndexers[i].getAnimation().currentLocation();
                    // console.log("Drawing sprite", location);
                    this.ctx.drawImage(indexerImg, location.x * 50, location.y * 50, 50, 50, activeIndexers[i].xCoord + this.viewTransform.t_offset_X + this.indexerXBuffer, activeIndexers[i].yCoord + this.viewTransform.t_offset_Y + this.indexerYBuffer, 80, 80);
                    break;
            }
        }
    };

    Render.prototype.renderProjectiles = function(activeProjectiles) {
        var recordImg = this.imageManager.getImage(ImageManager.REC_BRWN);
        for (var i = 0; i < activeProjectiles.length; i++) {
            switch (activeProjectiles[i].type) {
                case "strong":
                    recordImg = this.imageManager.getImage(ImageManager.REC_GOLD);
                    break;
                case "uber":
                    recordImg = this.imageManager.getImage(ImageManager.REC_GREN);
                    break;
                default:
                    recordImg = this.imageManager.getImage(ImageManager.REC_BRWN);
            }
            this.ctx.drawImage(recordImg, activeProjectiles[i].xCoord + this.viewTransform.t_offset_X + this.projectileXOffset, activeProjectiles[i].yCoord + this.viewTransform.t_offset_Y + this.projectileYOffset, recordImg.width / 3, recordImg.height / 3);
        }
    };

    Render.prototype.renderDrops = function(activeDrops) {
        for (var i = 0; i < activeDrops.length; i++){
            var dropImg = this.imageManager.getImage(activeDrops[i].imgURL);
            this.ctx.drawImage(dropImg, activeDrops[i].xCoord + this.viewTransform.t_offset_X + this.indexerXBuffer, activeDrops[i].yCoord + this.viewTransform.t_offset_Y + this.indexerYBuffer, dropImg.width * 1.6, dropImg.height * 1.6);
        }
    }

    Render.prototype.renderBuildings = function(activeBuildings) {
        var buildingImg = this.imageManager.getImage(ImageManager.BLD_FHCR);
        for (var i = 0; i < activeBuildings.length; i++) {
            switch (activeBuildings[i].type) {
                case "library":
                    buildingImg = this.imageManager.getImage(ImageManager.BLD_LIBR);
                    break;
                default:
                    buildingImg = this.imageManager.getImage(ImageManager.BLD_FHCR);
            }
            this.ctx.drawImage(buildingImg, activeBuildings[i].xCoord + this.viewTransform.t_offset_X + this.standardBuildingXOffset, activeBuildings[i].yCoord + this.viewTransform.t_offset_Y + this.standardBuildingYOffset);
            //console.log("drawing building: " + i + " x: " + activeBuildings[i].xCoord + this.viewTransform.t_offset_X + " y: " + activeBuildings[i].yCoord + this.viewTransform.t_offset_Y);
        }
    };


    Render.prototype.renderTriangularPlayingField = function(levelStructure)
    {
        var alphaImg = this.imageManager.getImage(ImageManager.TRI_ALPH);

        var betaImg = this.imageManager.getImage(ImageManager.TRI_BETA);
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
        var nodeImg = this.imageManager.getImage(ImageManager.NODE_CIR);
        for (var i = 0; i < nodeStructure.length; i++)
        {
            for (var j = 0; j < nodeStructure[i].length; j++)
            {
                if (!nodeStructure[i][j].occupied)
                {
                    //draw node here
                    this.ctx.drawImage(nodeImg, nodeStructure[i][j].animFrame * 50,0,50,50,nodeStructure[i][j].xCoord + this.viewTransform.t_offset_X + this.nodeOffset,nodeStructure[i][j].yCoord + this.viewTransform.t_offset_Y + this.nodeOffset,50,50);
                }
            }
        }
    };

    Render.prototype.renderTree = function(levelStructure)
    {
        var tree = this.imageManager.getImage(ImageManager.UND_TREE);
        this.ctx.drawImage(tree, 100, 100, (tree.width - 200)/8 * levelStructure.length, tree.height, 0 + this.viewTransform.t_offset_X, -900 + this.viewTransform.t_offset_Y, (tree.width - 200)/8 * levelStructure.length, tree.height);
    };

    Render.prototype.renderButtons = function(activeButtons, activePlaceButtons) {
        for (var i = 0; i < activeButtons.length; i++) {
            var buttonImg = this.imageManager.getImage(activeButtons[i].imgURL);
            //console.log("trying to draw button", activeButtons[i]);

            this.ctx.drawImage(buttonImg, activeButtons[i].xCoord, activeButtons[i].yCoord);
        }
        for (var i = 0; i < activePlaceButtons.length; i++) {
            var buttonImg = this.imageManager.getImage(activePlaceButtons[i].imgURL);

            this.ctx.drawImage(buttonImg, activePlaceButtons[i].xCoord, activePlaceButtons[i].yCoord);
        }
    }

    Render.prototype.reset = function()
    {
        this.resizeOnce = true;
    };

    Render.prototype.render = function(active, canvas, translation, levelStructure, nodeStructure) {
        //console.log("Render Offsets:", this.xOffset, this.viewTransform.t_offset_Y, translation, translation.dx, translation.dy);
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.renderBackground();
        this.renderTree(levelStructure);
        this.renderTriangularPlayingField(levelStructure);
        this.renderNodeStructure(nodeStructure);
        this.renderDrops(active.drops());
        this.renderIndexers(active.indexers());
        this.renderBuildings(active.buildings());
        this.renderAncestors(active.ancestors());
        this.renderProjectiles(active.projectiles());
        this.renderRecords(active.records());
        this.renderButtons(active.activeButtons, active.activePlaceButtons);
    };

    return Render;

});
