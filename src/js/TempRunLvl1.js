define(['GameController'],function(GameController) {

    function TempRunLvl1()
    {

    }

    TempRunLvl1.prototype.run = function(canvas)
    {
      var myGameController = new GameController(canvas);
      myGameController.initializeGame(3,{});
      myGameController.loop();
    };

    return TempRunLvl1;
});
