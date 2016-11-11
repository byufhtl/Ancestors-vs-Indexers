define(['jquery','LevelDefinition', 'game/Update', 'game/Render', 'model/IAncestor', 'game/ViewTransform', 'util/Sig',
        'game/GameEventManager', 'game/GameButtons', 'game/board/Board', 'game/Player', 'virus/Virus'],
  function($,LevelDefinition, Update, Render, IAncestor, ViewTransform, Sig, GameEventManager, GameButtons, Board, Player, Virus) {

      function GameController(lieutenant) {
          this.controller = lieutenant;
          this.myUpdate = new Update();
          this.translation = {dx: 0, dy: 0};

          this.viewTransform;
          this.audio = null;
          this.paused = false;
      }

      GameController.prototype.init = function(){
          this.eventManager = new GameEventManager(this);
      };

      GameController.prototype.handle = function(event){
          var self = this;
          switch(event.type){
              case Sig.CMND_ACT:
                  self.obeyCommand(event.value, event.data);
                  break;
              case Sig.FTCH_IMG:
                  return self.controller.handle(event);
                  break;
              case Sig.UPD_USER:
                  self.controller.handle(event);
                  break;
              case Sig.LVL_CMND:
                  self.controller.handle(event);
                  break;
              case Sig.BTN_ACTN:
                  self.eventManager.handle(event);
                  break;
              case Sig.ST_CLICK:
                  self.eventManager.handle(event);
                  break;
              case Sig.CNVS_CLK:
                  self.eventManager.handle(event);
                  break;
              case Sig.CNVS_DRG:
                  self.eventManager.handle(event);
                  break;
              case Sig.KEY_ACTN:
                  self.eventManager.handle(event);
                  break;
              case Sig.LD_MODAL:
                  self.eventManager.handle(event);
                  break;
              case Sig.UPD_RNDR:
                  self.myRender.setBoard(self.board);
          }
      };

      GameController.prototype.obeyCommand = function(value, data){
          var self = this;
            switch(value){
                case Sig.DISBL_UI:
                    self.paused = true;
                    break;
                case Sig.ENABL_UI:
                    self.paused = false;
                    self.__lastTime = Date.now();
                    break;
                case Sig.INIT_GAM:
                    self.initializeGame(data.act, data.scene, data.playerInfo, data.imageManager);
                    break;
            }
      };

      GameController.prototype.initializeGame = function (act, scene, playerInfo, imageManager) {
          this.myRender = new Render(this.canvas, this.viewTransform, imageManager);
          this.myUpdate = new Update(this);
          this.currentAct = act ? act : 1; // Set act (default: 1)
          this.currentScene = scene ? scene : 1; // Set scene (default: 1)
          this.eventManager.handle(new Sig(Sig.ST_CLICK, null, {}));

          // this.audio = new Audio("src/audio/better.wav");
          // this.audio.play();
          this.active = new ActiveData();

          //adding buttons to canvas
          GameButtons.addAll(this.active.activeButtons);
          this.defeatedAncestorInfo = [];

          //player info from the database
          this.playerInfo = playerInfo;
          console.log("ABOUT TO RENDER BOARD");
          //get board
          this.board = LevelDefinition.generateBoard(this.currentAct, this.currentScene);
          console.log("DONE GENERATING BOARD");
          this.myRender.setBoard(this.board);
          //setting up player
          this.player = new Player();
          this.player.playerCellPosition = {xCoord: this.board.playerStartingPosition.xCoord, yCoord: this.board.playerStartingPosition.yCoord};
          this.player.playerPixelPosition = {xCoord: this.board.playerStartingPosition.xCoord * 150, yCoord: this.board.playerStartingPosition.yCoord * 150};

          //setting up ancestors for level
          LevelDefinition.setRealAncestors(this.active.activeAncestors, this.eightGenerations, this.board, this.currentAct, this.currentScene);

          console.log("we've added: " + this.active.activeAncestors.length + " ancestors");
          var pt = this.board.__clumpToTile[1][0];
          var pt2 = this.board.__clumpToTile[2][0];
          // var pt3 = this.board.__clumpToTile[3][0];
          this.viruses = [];
          this.viruses.push(new Virus(pt.row, pt.col));
          this.viruses.push(new Virus(pt2.row, pt2.col));
          // this.viruses.push(new Virus(pt3.row, pt3.col));
          for(var virus of this.viruses){
              virus.setTarget(this.player);
          }

          this.__lastTime = Date.now();

          this.loop();
      };

      GameController.prototype.updateCoordinates = function (dx, dy) {
          this.translation = {dx: dx, dy: dy};
          //console.log("Coordinates updated to:",this.translation);
      };

      GameController.prototype.loop = function () {
          if (!this.paused) {
              var now = Date.now();
              var delta_s = (now - this.__lastTime) / 1000; // obtain time elapsed since last check and convert to seconds
              this.__lastTime = now;

              for(var virus of this.viruses) {
                  virus.move(delta_s, this.board);
              }
              // this.virus.poll();

              this.myUpdate.update(this.active, delta_s, this.defeatedAncestorInfo, this.player, this.board);
              this.myRender.render(this.active, this.board, this.canvas, this.translation, this.player, this.viruses);
              this.updateCoordinates(0, 0);
          }
          if (this.active.gameEnded() == false) // game end condition.
          {
              requestAnimationFrame(this.loop.bind(this));
          }
          else {
              if (this.active.victory() == true) {
                  this.controller.handle(new Sig(Sig.UPD_USER, Sig.LVL_VCTR));
                  GameButtons.addVictoryButtons(this.active.optionButtons);
                  this.myRender.renderVictory(this.active.optionButtons);
                  this.myRender.reset();
                  if (this.defeatedAncestorInfo.length != 0) {
                      this.handle(new Sig(Sig.LD_MODAL, Sig.ANC_INFO, {tempData:0}));
                  }
              }
              else {
                  this.controller.handle(new Sig(Sig.UPD_USER, Sig.LVL_DEFT));
                  GameButtons.addDefeatButtons(this.active.optionButtons);
                  console.log("WHERE ARE MY DEFEAT BUTTONS", this.active.optionButtons);
                  this.myRender.renderDefeat(this.active.optionButtons);
                  this.myRender.reset();
              }
          }
      };

      function ActiveData(){
          this.activeButtons = [];
          this.activePlaceButtons = [];
          this.optionButtons = [];
          this.activeAncestors = [];
          this.activeProjectiles = [];
          this.activeRecords = [];
          this.activeDrops = [];
          this.resourcePoints = 20;
          this.ended = false;
          this.vtry = false;
      }
      ActiveData.prototype.drops = function(){
          return this.activeDrops;
      };
      ActiveData.prototype.points = function(){
          return this.resourcePoints;
      };
      ActiveData.prototype.gameEnded = function(){
          return this.ended;
      };
      ActiveData.prototype.victory = function(){
          return this.vtry;
      };
      ActiveData.prototype.ancestors = function(){
          return this.activeAncestors;
      };

      ActiveData.prototype.indexers = function () {
          return this.activeIndexers;
      };

      ActiveData.prototype.projectiles = function() {
          return this.activeProjectiles;
      };

      ActiveData.prototype.records = function() {
          return this.activeRecords;
      };

      ActiveData.prototype.buildings = function() {
          return this.activeBuildings;
      };



      return GameController;
  });
