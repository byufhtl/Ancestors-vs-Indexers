define(['jquery','LevelDefinition', 'ViewController', 'Update', 'Render', 'model/IAncestor', 'VictoryDefeatHandler', 'ImageManager', 'ViewTransform'],
  function($,LevelDefinition, ViewController, Update, Render, IAncestor, VictoryDefeatHandler, ImageManager, ViewTransform) {

      function GameController(canvas) {

          this.canvas = canvas;
          this.myUpdate = new Update();
          this.myRender = null;
          this.translation = {dx: 0, dy: 0};
          this.myVictoryDefeatHandler = new VictoryDefeatHandler();

          this.resourcePoints = 200;

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
          this.viewTransform = new ViewTransform(0, 0);
          this.viewController = new ViewController(this);
          console.log("Hello World?");
          this.viewController.init();
      }

      GameController.prototype.loadResources = function () {
          var self = this;
          return new Promise(function (resolve, reject) {
              ImageManager.launch().then(function (response) {
                      self.myRender = new Render(canvas, ImageManager);
                      resolve(response);
                  },
                  function (e) {
                      console.log("The ImageManager was not able to load correctly. Response:", e);
                      self.myRender = new Render(canvas, ImageManager);
                      reject(e);
                  });
          });
      };


      GameController.prototype.initializeGame = function (level, playerInfo) {
          this.myUpdate = new Update();
          for (var i = 0; i < 9; i++) {
              this.gameBoardGrid[i] = [];
              for (var j = 0; j < 5; j++) {
                  this.gameBoardGrid[i][j] = 0;
              }
          }
          this.currentLevel = level;
          this.resourcePoints = 200;

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

          this.level = levelDefinition.getLevel(level); // Wave information location
          this.levelStructure = levelDefinition.getLevelStructure(level);
          this.nodeStructure = levelDefinition.getNodeStructure(level);
          console.log(this.nodeStructure);

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

          this.myUpdate.update(this.activeAncestors, this.activeIndexers, this.activeProjectiles, this.activeRecords, this.activeBuildings, delta_s, this.level, this);
          this.myRender.render(this.activeAncestors, this.activeIndexers, this.activeProjectiles, this.activeRecords, this.activeBuildings, this.canvas, this.translation, this.levelStructure, this.nodeStructure);
          this.updateCoordinates(0, 0);
          if (!this.gameEnded) // game end condition.
          {
              requestAnimationFrame(this.loop.bind(this));
          }
          else {
              if (this.victory) {
                  this.myVictoryDefeatHandler.victory(this.myRender, this);
              }
              else {
                  this.myVictoryDefeatHandler.defeat(this.myRender, this);
              }
          }
      };

      return GameController;

  });
