define(['LevelDefinition, Update, Render'],function(LevelDefinition) {

    function GameController() {
      this.myUpdate = new Update();
      this.myRender = new Render();

      this.timeElapsed;
      this.gameOver;
      this.canvas;
      this.then;
      this.playerInfo;
      this.level;

      this.activeAncestors;
      this.activeIndexers;
      this.activeBuildings;
    }


    GameController.prototype.initializeGame = function(level, playerInfo)
    {
        this.timeElapsed = 0;
        this.gameOver = 0;
        this.canvas = 0;
        this.then = Date.now();
        this.playerInfo = playerInfo;
        var levelDefinition = new levelDefinition();
        this.level = levelDefinition.getLevel(level);
    };

    GameController.prototype.loop = function()
    {
      var now = Date.now();
    	var delta = now - then;
      this.then = now;
    	this.totalTime += delta/1000;

      myUpdate.update(this.activeAncestors, this.activeIndexers, delta/1000);
      myRender.render(this.activeAncestors, this.activeIndexers, activeBuildings);

      window.webkitrequestAnimationFrame(this.loop.bind(this));
    }


    return GameController;

});
