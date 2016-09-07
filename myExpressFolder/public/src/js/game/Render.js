define(['img/ImageManager'],function(ImageManager) {


    function Render(canvas, ViewTransform, imageManager)
    {
        this.imageManager = imageManager;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.boardCanvas = null;
        this.viewTransform = ViewTransform;
        //offsets for different images, since they render from the corner of the image. These are based on image size/2
        this.ancestorXBuffer = -36;
        this.ancestorYBuffer = -70;

        this.indexerXBuffer = -38;
        this.indexerYBuffer = -73;

        this.nodeOffset = -25;

        this.projectileXOffset = -33;
        this.projectileYOffset = -65;

        this.recordOffset = -50;
        this.resizeOnce = true;

        this.treeWidth = 2400;
    }

    Render.prototype.renderVictory = function(optionButtons)
    {
        var victoryImg = this.imageManager.getImage(ImageManager.GM_VCTRY);
        this.ctx.drawImage(victoryImg, 0, 0, victoryImg.width, victoryImg.height, 0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < optionButtons.length; i++) {
            var buttonImg = this.imageManager.getImage(optionButtons[i].imgURL);
            this.ctx.drawImage(buttonImg, optionButtons[i].xCoord, optionButtons[i].yCoord);
        }
    };

    Render.prototype.renderDefeat = function(optionButtons)
    {
        var defeatImg = this.imageManager.getImage(ImageManager.GM_DFEAT);
        this.ctx.drawImage(defeatImg, 0, 0, defeatImg.width, defeatImg.height, 0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < optionButtons.length; i++) {
            var buttonImg = this.imageManager.getImage(optionButtons[i].imgURL);
            this.ctx.drawImage(buttonImg, optionButtons[i].xCoord, optionButtons[i].yCoord);
        }
    };

    Render.prototype.renderBackground = function()
    {
        var bgImg = this.imageManager.getImage(ImageManager.BKGD_IMG);
        // console.log("W/H:", bgImg.width, bgImg.height);
        this.ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, 0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.drawImage(bgImg, (bgImg.width+this.viewTransform.t_offset_X/2)/4, (bgImg.height+this.viewTransform.t_offset_Y/2)/4, bgImg.width, bgImg.height, 0, 0, bgImg.width, bgImg.height); //, this.canvas.width, this.canvas.height);
    };

    Render.prototype.renderFamilyMemberName = function(activeAncestors, i)
    {
        this.ctx.font = "10px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(activeAncestors[i].name, activeAncestors[i].xCoord + this.viewTransform.t_offset_X + this.ancestorXBuffer, activeAncestors[i].yCoord + this.viewTransform.t_offset_Y + this.ancestorYBuffer);
        this.ctx.fillStyle = "black";
    };

    Render.prototype.renderAncestors = function(activeAncestors, player)
    {
        var ancImg = this.imageManager.getImage(ImageManager.ANC_STAN);
        for (var i = 0; i < activeAncestors.length; i++)
        {
              ancImg = this.imageManager.getImage(ImageManager.ANC_STAN);
              this.ctx.drawImage(ancImg, activeAncestors[i].pixelPosition.xCoord - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2,  activeAncestors[i].pixelPosition.yCoord - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
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
    };

    Render.prototype.renderButtons = function(activeButtons, activePlaceButtons, optionButtons) {
        for (var i = 0; i < activeButtons.length; i++) {
            var buttonImg = this.imageManager.getImage(activeButtons[i].imgURL);
            //console.log("trying to draw button", activeButtons[i]);

            this.ctx.drawImage(buttonImg, activeButtons[i].xCoord, activeButtons[i].yCoord);
        }
        for (var i = 0; i < activePlaceButtons.length; i++) {
            var buttonImg = this.imageManager.getImage(activePlaceButtons[i].imgURL);

            this.ctx.drawImage(buttonImg, activePlaceButtons[i].xCoord, activePlaceButtons[i].yCoord);
        }

    };

    Render.prototype.renderPoints = function(points) {
        this.ctx.font = "50px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(points,window.innerWidth / 2, window.innerHeight / 12);
        this.ctx.font = "10px Arial";
        this.ctx.fillStyle = "black";
    };

    Render.prototype.reset = function()
    {
        this.resizeOnce = true;
    };


    Render.prototype.renderBoard = function(board, player)
    {
        // for (var y = 0; y < board.length; y++){
        //     for (var x = 0; x < board[y].length; x++){
        //         if (board[y][x] != null){
        //
        //             var img = this.imageManager.getImage(board[y][x].image);
        //             this.ctx.drawImage(img, x * 150 - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2, y * 150 - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
        //             if (board[y][x].database){
        //               var databaseImg = this.imageManager.getImage(ImageManager.DTB_TILE);
        //               this.ctx.drawImage(databaseImg, x * 150 - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2, y * 150 - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
        //             }
        //             if (board[y][x].startingPosition){
        //               // console.log("rendering tree");
        //               var treeImg = this.imageManager.getImage(ImageManager.STRT_POS);
        //               this.ctx.drawImage(treeImg, x * 150 - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2, y * 150 - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
        //             }
        //             if (board[y][x].locked){
        //                 var lockImg = this.imageManager.getImage(ImageManager.LCK_TILE);
        //                 this.ctx.drawImage(lockImg, x * 150 - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2, y * 150 - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
        //             }
        //         }
        //     }
        // }

        for(var z = 0; z < board.tileCoordList.length; z++){
            var y = board.tileCoordList[z].row;
            var x = board.tileCoordList[z].col;
            // console.log("<<RENDERER>> Rendering tile @ (" + y + "," + x + ").");
            var fTile = board.tileArray[y][x];
            var img = this.imageManager.getImage(fTile.image);
            this.ctx.drawImage(img, x * 150 - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2, y * 150 - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
            if (fTile.database){
                var databaseImg = this.imageManager.getImage(ImageManager.DTB_TILE);
                this.ctx.drawImage(databaseImg, x * 150 - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2, y * 150 - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
            }
            if (fTile.startingPosition){
                var startingPointImg = this.imageManager.getImage(ImageManager.STRT_POS);
                this.ctx.drawImage(startingPointImg, x * 150 - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2, y * 150 - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
            }
            if (fTile.locked){
                var lockImg = this.imageManager.getImage(ImageManager.LCK_TILE);
                this.ctx.drawImage(lockImg, x * 150 - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2, y * 150 - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
            }
        }
    };

    Render.prototype.renderBoardFast = function(player){
        this.ctx.drawImage(this.boardCanvas,  -player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2,  -player.playerPixelPosition.yCoord + window.innerHeight/2 + this.viewTransform.t_offset_Y)
    };

    Render.prototype.setBoard = function(board){
        this.boardCanvas = document.createElement('canvas');
        this.boardCanvas.height = 150 * board.metaData.rows;
        this.boardCanvas.width = 150 * board.metaData.cols;
        var bCtx = this.boardCanvas.getContext('2d');
        for(var z = 0; z < board.tileCoordList.length; z++){
            var y = board.tileCoordList[z].row;
            var x = board.tileCoordList[z].col;
            // console.log("<<RENDERER>> Rendering tile @ (" + y + "," + x + ").");
            var fTile = board.tileArray[y][x];
            var img = this.imageManager.getImage(fTile.image);
            bCtx.drawImage(img, x * 150, y * 150);
            if (fTile.database){
                var databaseImg = this.imageManager.getImage(ImageManager.DTB_TILE);
                bCtx.drawImage(databaseImg, x * 150, y * 150);
            }
            if (fTile.startingPosition){
                var startingPointImg = this.imageManager.getImage(ImageManager.STRT_POS);
                bCtx.drawImage(startingPointImg, x * 150, y * 150);
            }
            if (fTile.locked){
                var lockImg = this.imageManager.getImage(ImageManager.LCK_TILE);
                bCtx.drawImage(lockImg, x * 150, y * 150);
            }
        }
        var keyImage = this.imageManager.getImage(ImageManager.KEY_ICON);
        bCtx.drawImage(keyImage, board.key.xCoord * 150, board.key.yCoord * 150);
    };



    Render.prototype.renderMiniMap = function(board, player, ancestors)
    {
      this.ctx.fillStyle = "rgba(40, 40, 40, 0.5)";
      this.ctx.fillRect(30, 30, board.tileArray[0].length * 3,  board.tileArray.length * 3);
      this.ctx.fillStyle = "blue";
      //fill in tile information
      for (var y = 0; y < board.tileArray.length; y++){
          for (var x = 0; x < board.tileArray[y].length; x++){
              if (board.tileArray[y][x] != null){
                  if (board.tileArray[y][x].database) {
                      this.ctx.fillStyle = "red";
                      this.ctx.fillRect(x*3 + 30, y*3 + 30, 2, 2);
                  }
                  else if (board.tileArray[y][x].startingPosition){
                      this.ctx.fillStyle = "yellow";
                      this.ctx.fillRect(x*3 + 30, y*3 + 30, 2, 2);
                  }
                  else if (x == player.playerCellPosition.xCoord && y == player.playerCellPosition.yCoord){
                      this.ctx.fillStyle = "white";
                      this.ctx.fillRect(x*3 + 30, y*3 + 30, 2, 2);
                  }
                  else if (board.tileArray[y][x].locked){
                      this.ctx.fillStyle = "green";
                      this.ctx.fillRect(x*3 + 30, y*3 + 30, 2, 2);
                  }
                  else{
                      this.ctx.fillStyle = "blue";
                      this.ctx.fillRect(x*3 + 30, y*3 + 30, 2, 2);
                  }
              }
          }

      }
      //fill in ancestor information
      this.ctx.fillStyle = "orange";
      for (var i = 0; i < ancestors.length; i++){
          this.ctx.fillRect(ancestors[i].cellPosition.xCoord*3 + 30, ancestors[i].cellPosition.yCoord*3 + 30, 2, 2);
      }
      this.ctx.fillStyle = "purple";
      this.ctx.fillRect(board.key.xCoord*3 + 30, board.key.yCoord*3 + 30, 2, 2);
      this.ctx.fillStyle = "black";
    };

    Render.prototype.renderPlayer = function(player){
        var playerImage = this.imageManager.getImage(ImageManager.VRS_FORE);
        this.ctx.drawImage(playerImage,window.innerWidth/2, window.innerHeight/2);
    };

    Render.prototype.render = function(active, board, canvas, translation, player) {
        //console.log("Render Offsets:", this.xOffset, this.viewTransform.t_offset_Y, translation, translation.dx, translation.dy);

        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        //this.renderBackground();
        if(!this.boardCanvas) {
            this.renderBoard(board, player);
        }
        else{
            // console.log("<<RENDER>> FAST VERSION");
            this.renderBoardFast(player);
        }
        this.renderMiniMap(board, player, active.activeAncestors);
        this.renderPlayer(player);
        //this.renderDrops(active.drops());
        this.renderAncestors(active.ancestors(), player);
        //this.renderProjectiles(active.projectiles());
        //this.renderRecords(active.records());
        this.renderButtons(active.activeButtons, active.activePlaceButtons, active.optionButtons);
        this.renderPoints(active.points());
    };

    return Render;

});
