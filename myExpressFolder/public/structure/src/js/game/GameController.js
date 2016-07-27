define(['jquery','LevelDefinition', 'game/Update', 'game/Render', 'model/IAncestor', 'game/ViewTransform', 'util/Sig'],
  function($,LevelDefinition, Update, Render, IAncestor, ViewTransform, Sig) {

      function GameController(lieutenant) {
          this.controller = lieutenant;
          this.myUpdate = new Update();
          this.translation = {dx: 0, dy: 0};

          this.levelStructure = null;
          this.nodeStructure = null;

          this.gameBoardGrid = {};

          this.viewTransform;

          this.paused = false;
      }

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
                    self.lastTime = Date.now();
                    break;
                case Sig.INIT_GAM:
                    self.initializeGame(data.act, data.scene, data.playerInfo, data.imageManager);
                    break;
            }
      };

      GameController.prototype.initializeGame = function (act, scene, playerInfo, imageManager) {
          this.myRender = new Render(this.canvas, this.viewTransform, imageManager);
          this.currentAct = act ? act : 1; // Set act (default: 1)
          this.currentScene = scene ? scene : 1; // Set scene (default: 1)

          this.active = new ActiveData();

          this.defeatedAncestorInfo = [];

          this.playerInfo = playerInfo;

          this.level = LevelDefinition.getScene(this.currentAct, scene, this.eightGenerations); // Wave information location
          this.levelStructure = LevelDefinition.getLevelStructure(act);
          this.nodeStructure = LevelDefinition.getNodeStructure(act);

          this.lastTime = Date.now();

          this.loop();
      };

      GameController.prototype.updateCoordinates = function (dx, dy) {
          this.translation = {dx: dx, dy: dy};
          //console.log("Coordinates updated to:",this.translation);
      };

      GameController.prototype.loop = function () {
          if (!this.paused) {
              var now = Date.now();
              var delta_s = (now - this.lastTime) / 1000; // obtain time elapsed since last check and convert to seconds
              this.lastTime = now;

              this.myUpdate.update(this.active, delta_s, this.level, this.levelStructure, this.defeatedAncestorInfo);
              this.myRender.render(this.active, this.canvas, this.translation, this.levelStructure, this.nodeStructure);
              this.updateCoordinates(0, 0);
          }
          if (this.active.gameEnded() == false) // game end condition.
          {
              requestAnimationFrame(this.loop.bind(this));
          }
          else {
              if (this.active.victory() == true) {
                  this.controller.handle(new Sig(Sig.LD_SDBAR, Sig.VTRY_PNL));
                  this.controller.handle(new Sig(Sig.LD_TPBAR, Sig.BLNK_PNL));
                  this.myRender.renderVictory();
                  this.myRender.reset();
                  if (this.defeatedAncestorInfo.length != 0) {
                      this.controller.handle(new Sig(Sig.LD_MODAL, Sig.ANC_INFO, {tempData:0}));
                  }
              }
              else {
                  this.controller.handle(new Sig(Sig.LD_SDBAR, Sig.DEFT_PNL));
                  this.controller.handle(new Sig(Sig.LD_TPBAR, Sig.BLNK_PNL));
                  this.myRender.renderDefeat();
                  this.myRender.reset();
              }
          }
      };

      function ActiveData(){
          this.activeAncestors = [];
          this.activeIndexers = [];
          this.activeProjectiles = [];
          this.activeRecords = [];
          this.activeBuildings = [];
          this.resourcePoints = 0;
          this.ended = false;
          this.vtry = false;
      }
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
