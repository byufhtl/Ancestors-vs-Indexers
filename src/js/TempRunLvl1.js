define(['GameController'],function(GameController) {

    function TempRunLvl1()
    {

    }

    TempRunLvl1.prototype.run = function(canvas)
    {
      var myGameController = new GameController(canvas);
      myGameController.initializeGame(2,{});
      myGameController.loop();
    };

    return TempRunLvl1;
});
