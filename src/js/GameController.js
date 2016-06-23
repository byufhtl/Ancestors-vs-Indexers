define(['jquery','LevelDefinition', 'ClickManager', 'Update', 'Render', 'model/IAncestor'],
    function($,LevelDefinition, ClickManager, Update, Render, IAncestor) {

    function GameController(canvas) {
      this.canvas = canvas;
      this.myUpdate = new Update();
      this.myRender = new Render(canvas);
      this.resourcePoints = 0;

      this.timeElapsed = 0;
      this.gameOver;

      this.lastTime;
      this.playerInfo;
      this.level = [];

      this.activeAncestors = [];
      this.activeIndexers = [];
      this.activeBuildings = [];
      this.activeRecords = [];
      this.activeProjectiles = [];

      this.gameBoardGrid = [];
    }


    GameController.prototype.initializeGame = function(level, playerInfo)
    {
        for (var i = 0; i < 5; i++)
        {
          this.gameBoardGrid[i] = false;
          for (var j = 0; j < 9; j++)
          {
            this.gameBoardGrid[i][j] = false;
          }
        }
        this.timeElapsed = 0;
        this.gameOver = 0;
        this.canvas = 0;
        this.playerInfo = playerInfo;
        var levelDefinition = new LevelDefinition();
        this.level = levelDefinition.getLevel(level); // Information location
        this.lastTime = Date.now();
        this.clickManager = new ClickManager(this);
        this.clickManager.start();
    };

    GameController.prototype.loop = function()
    {
      //console.log("running loop");
      var now = Date.now();
    	var delta_s = (now - this.lastTime)/1000; // obtain time elapsed since last check and convert to seconds
      this.lastTime = now;
    	this.timeElapsed += delta_s;

      this.myUpdate.update(this.activeAncestors, this.activeIndexers, this.activeProjectiles, this.activeRecords, delta_s, this.level);
      this.myRender.render(this.activeAncestors, this.activeIndexers, this.activeRecords, this.activeBuildings, this.canvas);
      if (this.timeElapsed < 40) // game end condition.
      {
        requestAnimationFrame(this.loop.bind(this));
      }
      else{
          this.clickManager.stop();
      }
    };

    return GameController;

});
