define(['LevelDefinition', 'Update', 'Render', 'model/IAncestor'],function(LevelDefinition, Update, Render, IAncestor) {

    function GameController(canvas) {
      this.canvas = canvas;
      this.myUpdate = new Update();
      this.myRender = new Render(canvas);

      this.timeElapsed = 0;
      this.gameOver;

      this.lastTime;
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
        this.level = levelDefinition.getLevel(level); // Information location
        this.lastTime = Date.now();
    };

    GameController.prototype.loop = function()
    {
      //console.log("running loop");
      var now = Date.now();
    	var delta_s = (now - this.lastTime)/1000; // obtain time elapsed since last check and convert to seconds
      this.lastTime = now;
    	this.timeElapsed += delta_s;

      this.myUpdate.update(this.activeAncestors, this.activeIndexers, delta_s, this.level);
      this.myRender.render(this.activeAncestors, this.activeIndexers, this.activeBuildings, this.canvas);
      if (this.timeElapsed < 10) // game end condition.
      {
        requestAnimationFrame(this.loop.bind(this));
      }
    };

    return GameController;

});