define(['LevelDefinition', 'Update', 'Render', 'model/IAncestor'],function(LevelDefinition, Update, Render, IAncestor) {

    function GameController() {
      this.myUpdate = new Update();
      this.myRender = new Render();

      this.timeElapsed = 0;
      this.gameOver;
      this.canvas;
      this.then;
      this.playerInfo;
      this.level = [];

      this.activeAncestors = [];
      this.activeIndexers = [];
      this.activeBuildings = [];
    }


    GameController.prototype.initializeGame = function(level, playerInfo)
    {
        this.timeElapsed = 0;
        this.gameOver = 0;
        this.canvas = 0;
        this.playerInfo = playerInfo;
        var levelDefinition = new LevelDefinition();
        this.level = levelDefinition.getLevel(level);
        this.then = Date.now();
    };

    GameController.prototype.loop = function()
    {
      //console.log("running loop");
      var now = Date.now();
    	var delta = now - this.then;
      this.then = now;
    	this.timeElapsed += delta/1000;

      this.myUpdate.update(this.activeAncestors, this.activeIndexers, delta/1000, this.level);
      this.myRender.render(this.activeAncestors, this.activeIndexers, this.activeBuildings);
      if (this.timeElapsed < 10)
      {
        requestAnimationFrame(this.loop.bind(this));
      }
    }

    return GameController;

});
