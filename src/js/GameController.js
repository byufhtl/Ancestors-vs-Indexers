define(['jquery','LevelDefinition', 'ViewController', 'Update', 'Render', 'model/IAncestor', 'ImageManager', 'ViewTransform', 'GEvent'],
  function($,LevelDefinition, ViewController, Update, Render, IAncestor, ImageManager, ViewTransform, GEvent) {

      function GameController() {

          this.myUpdate = new Update();
          this.myRender = null;
          this.translation = {dx: 0, dy: 0};

          this.resourcePoints = 0;

          this.timeElapsed = 0;

          this.lastTime;
          this.playerInfo;
          this.level = [];
          this.levelStructure;
          this.nodeStructure;

          this.activeAncestors = [];
          this.activeIndexers = [];
          this.activeBuildings = [];
          this.activeRecords = [];
          this.activeProjectiles = [];

          this.gameBoardGrid = {};

          this.gameEnded = false;
          this.victory;
          this.viewTransform = new ViewTransform(0, 0, this.canvas);
          this.viewController = new ViewController(this);
          this.viewController.init();
      }

      GameController.prototype.loadResources = function () {
          var self = this;
          return new Promise(function (resolve, reject) {
              ImageManager.launch().then(function (response) {
                      self.myRender = new Render(self.canvas, ImageManager, self.viewTransform);
                      resolve(response);
                  },
                  function (e) {
                      self.myRender = new Render(self.canvas, ImageManager, self.viewTransform);
                      reject(e);
                  });
          });
      };


      GameController.prototype.initializeGame = function (level, scene, playerInfo) {
          console.log("initialize game level: " + level);
          this.myUpdate = new Update();
          for (var i = 0; i < 9; i++) {
              this.gameBoardGrid[i] = [];
              for (var j = 0; j < 5; j++) {
                  this.gameBoardGrid[i][j] = 0;
              }
          }
          console.log("initialize game level2: " + level);
          this.currentAct = level? level : 1;
          console.log("sdflkasdlfd: " + this.currentAct);
          console.log("initialize game level3: " + level);
          this.currentScene = scene? scene : 1;
          this.resourcePoints = 0;

          this.timeElapsed = 0;

          this.lastTime;
          this.playerInfo;
          this.level = [];

          this.activeAncestors = [];
          this.activeIndexers = [];
          this.activeBuildings = [];
          this.activeRecords = [];
          this.activeProjectiles = [];

          this.gameEnded = false;
          this.victory = null;
          this.playerInfo = playerInfo;

          var levelDefinition = new LevelDefinition();
          this.level = levelDefinition.getScene(this.currentAct, scene); // Wave information location
          this.levelStructure = levelDefinition.getLevelStructure(level);
          this.nodeStructure = levelDefinition.getNodeStructure(level);

          this.lastTime = Date.now();
      };

      GameController.prototype.updateCoordinates = function (dx, dy) {
          this.translation = {dx: dx, dy: dy};
          //console.log("Coordinates updated to:",this.translation);
      };

      GameController.prototype.loop = function () {
          //console.log("running loop");
          var now = Date.now();
          var delta_s = (now - this.lastTime) / 1000; // obtain time elapsed since last check and convert to seconds
          this.lastTime = now;
          this.timeElapsed += delta_s;

          this.myUpdate.update(this.activeAncestors, this.activeIndexers, this.activeProjectiles, this.activeRecords, this.activeBuildings, delta_s, this.level, this, this.levelStructure);
          this.myRender.render(this.activeAncestors, this.activeIndexers, this.activeProjectiles, this.activeRecords, this.activeBuildings, this.canvas, this.translation, this.levelStructure, this.nodeStructure);
          this.updateCoordinates(0, 0);
          if (!this.gameEnded) // game end condition.
          {
              requestAnimationFrame(this.loop.bind(this));
          }
          else {
              if (this.victory) {
                  //type, value, data
                  var victoryEvent = new GEvent(GEvent.LD_SDBAR, GEvent.VTRY_PNL);
                  this.viewController.handle(victoryEvent);
                  var emptyTopBarEvent = new GEvent(GEvent.LD_TPBAR, GEvent.BLNK_PNL);
                  this.viewController.handle(emptyTopBarEvent);
                  this.myRender.renderVictory();
                  this.myRender.reset();

                  console.log("gameController current act: " + this.currentAct);
              }
              else {
                  var defeatEvent = new GEvent(GEvent.LD_SDBAR, GEvent.DEFT_PNL);
                  this.viewController.handle(defeatEvent);
                  var emptyTopBarEvent = new GEvent(GEvent.LD_TPBAR, GEvent.BLNK_PNL);
                  this.viewController.handle(emptyTopBarEvent);
                  this.myRender.renderDefeat();
                  this.myRender.reset();
              }
          }
      };

      return GameController;

  });
