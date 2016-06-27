define(['GameController','ImageManager'],function(GameController, ImageManager) {

    function TempRunLvl1()
    {

    }

    TempRunLvl1.prototype.run = function(canvas)
    {
        var myGameController = new GameController(canvas);
        myGameController.loadResources().then(function(response){
            myGameController.initializeGame(0,{});
            myGameController.loop();
        },
        function(e){
            console.log("Game was not able to load resources...");
        });

    };

    return TempRunLvl1;
});
