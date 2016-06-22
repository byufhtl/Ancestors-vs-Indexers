define(['GameController'],function(GameController) {

    function TempRunLvl1()
    {

    }

    TempRunLvl1.prototype.run = function()
    {
      myGameController = new GameController();
      myGameController.initializeGame(0,0);
      myGameController.loop();
    }

    return TempRunLvl1;
});
