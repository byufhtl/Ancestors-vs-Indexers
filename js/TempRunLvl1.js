define(['GameController'],function(GameController) {

    var TempRunLvl1 = function()
    {

    }

    var run = function()
    {
      myGameController = new GameController();
      myGameController.initializeGame(1,0);
      myGameController.loop();
    }

    return TempRunLvl1;
});
