define(['img/ImageManager','util/CoordUtils'],function(ImageManager,CoordUtils) {


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

    /**
     * Renders the victory screen.
     * @param optionButtons Buttons to be rendered on-screen.
     */
    Render.prototype.renderVictory = function(optionButtons)
    {
        var victoryImg = this.imageManager.getImage(ImageManager.GM_VCTRY);
        this.ctx.drawImage(victoryImg, 0, 0, victoryImg.width, victoryImg.height, 0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < optionButtons.length; i++) {
            var buttonImg = this.imageManager.getImage(optionButtons[i].imgURL);
            this.ctx.drawImage(buttonImg, optionButtons[i].xCoord, optionButtons[i].yCoord);
        }
    };

    /**
     * Renders the defeat screen.
     * @param optionButtons Buttons to be rendered on-screen.
     */
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

    Render.prototype.renderFamilyMemberName = function(activeAncestor, player)
    {
        this.ctx.font = "10px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(activeAncestor.name, activeAncestor.pixelPosition.xCoord - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2,  activeAncestor.pixelPosition.yCoord - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
        this.ctx.fillStyle = "black";
    };

    Render.prototype.renderAncestors = function(activeAncestors, player)
    {
        var ancImg = this.imageManager.getImage(ImageManager.ANC_STAN);
        for (var i = 0; i < activeAncestors.length; i++)
        {
            if(CoordUtils.proximate(activeAncestors[i].cellPosition.xCoord, activeAncestors[i].cellPosition.yCoord,
                player.playerCellPosition.xCoord, player.playerCellPosition.yCoord, 18, 10)) {
                if (activeAncestors[i].type == "familyMember") {
                    this.renderFamilyMemberName(activeAncestors[i], player);
                }
                ancImg = this.imageManager.getImage(ImageManager.ANC_STAN);
                this.ctx.drawImage(ancImg, activeAncestors[i].pixelPosition.xCoord - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth / 2, activeAncestors[i].pixelPosition.yCoord - player.playerPixelPosition.yCoord + window.innerHeight / 2 + this.viewTransform.t_offset_Y);
            }
        }
    };

    Render.prototype.renderEnemies = function(viruses, player)
    {
        for (var i = 0; i < viruses.length; i++){
            this.renderFamilyMemberName(viruses[i], player);
            var virImg = this.imageManager.getImage(ImageManager.VRS_FORE);
            this.ctx.drawImage(virImg, viruses[i].pixelPosition.xCoord - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2,  viruses[i].pixelPosition.yCoord - player.playerPixelPosition.yCoord +window.innerHeight/2 + this.viewTransform.t_offset_Y);
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
        this.ctx.fillText(points + " Records",window.innerWidth / 2, window.innerHeight / 12);
        this.ctx.font = "10px Arial";
        this.ctx.fillStyle = "black";
    };

    Render.prototype.renderRecordNames = function(names) {
        var offset = 0;
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        for (var i = 0; i < names.length; i++) {
            this.ctx.fillText(names[i], 30, window.innerHeight / 2 + offset);
            offset += 30;
        }
    };

    Render.prototype.reset = function() {
        this.resizeOnce = true;
    };

    /**
     * The slower way of rendering the board if a pre-rendered board has not been created. Not too great for speed, but
     * trusty in a jam. Speed enhanced by inclusion of only items that are close to the player.
     * @param board The Board object being referenced for drawing.
     * @param player The player to center the image relative to.
     */
    Render.prototype.renderBoard = function(board, player){
        var xOffset = - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth / 2;
        var yOffset = - player.playerPixelPosition.yCoord + this.viewTransform.t_offset_Y + window.innerHeight / 2;
        for(var z = 0; z < board.tileCoordList.length; z++){
            var y = board.tileCoordList[z].row;
            var x = board.tileCoordList[z].col;
            // console.log("<<RENDERER>> Rendering tile @ (" + y + "," + x + ").");
            if(CoordUtils.proximate(x, y, player.playerCellPosition.xCoord, player.playerCellPosition.yCoord, 18, 10)) {
                var fTile = board.tileArray[y][x];
                var img = this.imageManager.getImage(fTile.image);
                this.ctx.drawImage(img, x * 150 + xOffset, y * 150 + yOffset);
                if (fTile.database) {
                    var databaseImg = this.imageManager.getImage(ImageManager.DTB_TILE);
                    this.ctx.drawImage(databaseImg, x * 150 + xOffset, y * 150 + yOffset);
                }
                if (fTile.startingPosition) {
                    var startingPointImg = this.imageManager.getImage(ImageManager.STRT_POS);
                    this.ctx.drawImage(startingPointImg, x * 150 + xOffset, y * 150 + yOffset);
                }
                if (fTile.locked) {
                    var lockImg = this.imageManager.getImage(ImageManager.LCK_TILE);
                    this.ctx.drawImage(lockImg, x * 150 + xOffset, y * 150 + yOffset);
                }
                if (fTile.clumpID == 0) {
                    this.ctx.drawImage(this.imageManager.getImage(ImageManager.SPD_TILE), x * 150 + xOffset, y * 150 + yOffset);
                }
            }
        }
    };

    /**
     * Draws the board from the internally pre-rendered board canvas. Significantly faster if such a canvas has been
     * rendered beforehand
     * @param player The player to be used in determining where the image ought to be placed to appear centered.
     */
    Render.prototype.renderBoardFast = function(player){
        this.ctx.drawImage(this.boardCanvas,  -player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth/2,  -player.playerPixelPosition.yCoord + window.innerHeight/2 + this.viewTransform.t_offset_Y)
    };

    /**
     * Renders DYNAMIC non-entities onto the field if they are within an 18 square radius of the player (a.k.a. on-screen).
     * Dynamic non-entities include things like records and keys, but do not include things like ancestors or viruses.
     * @param board The board to reference for dynamic non-entities.
     * @param player The player to use as a reference point for whether or not an image needs to be drawn.
     */
    Render.prototype.renderPieces = function(board, player){
        var xOffset = - player.playerPixelPosition.xCoord + this.viewTransform.t_offset_X + window.innerWidth / 2;
        var yOffset = - player.playerPixelPosition.yCoord + this.viewTransform.t_offset_Y + window.innerHeight / 2;
        for(var dbt of board.databaseTiles){
            if(CoordUtils.proximate(dbt.xPos, dbt.yPos, player.playerCellPosition.xCoord, player.playerCellPosition.yCoord, 7, 6)){
                if (dbt.numRecords > 0){
                    this.ctx.drawImage(this.imageManager.getImage(ImageManager.REC_GOLD), dbt.xPos * 150 + xOffset, dbt.yPos * 150 + yOffset);
                }
            }
        }
        var keyImage = this.imageManager.getImage(ImageManager.KEY_ICON);
        if(CoordUtils.proximate(board.key.xCoord, board.key.yCoord, player.playerCellPosition.xCoord, player.playerCellPosition.yCoord, 7, 6)) {
            this.ctx.drawImage(keyImage, board.key.xCoord * 150 + xOffset, board.key.yCoord * 150 + yOffset);
        }
    };

    /**
     * Creates a static canvas with a pre-drawn board on it. This then becomes the image used to depict all STATIC
     * parts of the board (tiles, db's, etc). Dynamic elements such as ancestors, records, keys, viruses, etc are not
     * included in this pre-render.
     * @param board The board whose static elements are being identified and included.
     */
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
                // if (fTile.numRecords > 0){
                //   bCtx.drawImage(this.imageManager.getImage(ImageManager.REC_GOLD), x * 150, y * 150);
                // }
            }
            if (fTile.startingPosition){
                var startingPointImg = this.imageManager.getImage(ImageManager.STRT_POS);
                bCtx.drawImage(startingPointImg, x * 150, y * 150);
            }
            if (fTile.locked){
                var lockImg = this.imageManager.getImage(ImageManager.LCK_TILE);
                bCtx.drawImage(lockImg, x * 150, y * 150);
            }
            if (fTile.clumpID == 0){
                bCtx.drawImage(this.imageManager.getImage(ImageManager.SPD_TILE), x * 150, y * 150);
            }
        }
    };

    /**
     * Renders a mini map of the board in the top left corner of the canvas. The necessary items are tracked.
     * @param board The board to display
     * @param player The player's position
     * @param ancestors The ancestors to draw
     * @param viruses The viruses to draw
     */
    Render.prototype.renderMiniMap = function(board, player, ancestors, viruses) {
        this.ctx.fillStyle = "rgba(40, 40, 40, 0.5)";
        this.ctx.fillRect(30, 30, board.tileArray[0].length * 3, board.tileArray.length * 3);
        this.ctx.fillStyle = "blue";
        //fill in tile information
        for (var y = 0; y < board.tileArray.length; y++) {
            for (var x = 0; x < board.tileArray[y].length; x++) {
                if (board.tileArray[y][x] != null) {
                    if (board.tileArray[y][x].database) {
                        this.ctx.fillStyle = "red";
                        this.ctx.fillRect(x * 3 + 30, y * 3 + 30, 2, 2);
                    }
                    else if (board.tileArray[y][x].startingPosition) {
                        this.ctx.fillStyle = "yellow";
                        this.ctx.fillRect(x * 3 + 30, y * 3 + 30, 2, 2);
                    }
                    else if (x == player.playerCellPosition.xCoord && y == player.playerCellPosition.yCoord) {
                        this.ctx.fillStyle = "white";
                        this.ctx.fillRect(x * 3 + 30, y * 3 + 30, 2, 2);
                    }
                    else if (board.tileArray[y][x].locked) {
                        this.ctx.fillStyle = "green";
                        this.ctx.fillRect(x * 3 + 30, y * 3 + 30, 2, 2);
                    }
                    else {
                        this.ctx.fillStyle = "blue";
                        this.ctx.fillRect(x * 3 + 30, y * 3 + 30, 2, 2);
                    }
                }
            }
        }
        //fill in ancestor information
        this.ctx.fillStyle = "orange";
        for (var i = 0; i < ancestors.length; i++) {
            this.ctx.fillRect(ancestors[i].cellPosition.xCoord * 3 + 30, ancestors[i].cellPosition.yCoord * 3 + 30, 2, 2);
        }
        this.ctx.fillStyle = "purple";
        this.ctx.fillRect(board.key.xCoord * 3 + 30, board.key.yCoord * 3 + 30, 2, 2);
        this.ctx.fillStyle = "green";
        for(var k = 0; k < viruses.length; k++) {
            this.ctx.fillRect(viruses[k].cellPosition.xCoord * 3 + 30, viruses[k].cellPosition.yCoord * 3 + 30, 2, 2);
        }
    };

    /**
     * Renders the player sprite on-screen.
     * @param player The player whose animation is being tracked.
     */
    Render.prototype.renderPlayer = function(player){
        var playerImage = this.imageManager.getImage(ImageManager.MAIN_CHR);
        //this.ctx.drawImage(playerImage,window.innerWidth/2, window.innerHeight/2);
        this.ctx.drawImage(playerImage, player.animXFrame * 120, player.animYFrame * 120, 120, 120, window.innerWidth/2, window.innerHeight/2, 120, 120);
        //this.ctx.drawImage(ancImg, activeAncestors[i].animFrame * 50,0,50,50,activeAncestors[i].xCoord + this.viewTransform.t_offset_X + this.ancestorXBuffer,activeAncestors[i].yCoord + this.viewTransform.t_offset_Y + this.ancestorYBuffer,50,50);
    };

    /**
     * The general rendering function.
     * @param active A list of active entities
     * @param board The board being used as a reference for what needs to be drawn and where.
     * @param canvas The canvas on which to draw everything.
     * @param translation The overall view transform to be used in calculating relative positions.
     * @param player The player to use as a reference point for where the player is on the field for centering purposes.
     * @param viruses A temporary aberration that will eventually be included in the active object.
     */
    Render.prototype.render = function(active, board, canvas, translation, player, viruses) {
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
        this.renderMiniMap(board, player, active.activeAncestors, viruses[0]);
        this.renderPieces(board, player);
        this.renderPlayer(player);
        //this.renderDrops(active.drops());
        this.renderAncestors(active.ancestors(), player);
        this.renderEnemies(viruses, player);
        this.renderRecordNames(player.namedRecords);
        //this.renderProjectiles(active.projectiles());
        //this.renderRecords(active.records());
        this.renderButtons(active.activeButtons, active.activePlaceButtons, active.optionButtons);
        this.renderPoints(player.numRecords);
    };

    return Render;

});
