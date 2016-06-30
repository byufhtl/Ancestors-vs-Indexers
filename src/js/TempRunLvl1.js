define(['jquery','GameController','ImageManager'],function($, GameController, ImageManager) {

    function TempRunLvl1(){}


    TempRunLvl1.prototype.loadMenu = function() {
        var self = this;
        var menuHolder = $('#menu');
        menuHolder.load("src/html/menu.html", function (response) {
            $('#startGame').click(function () {
                $('#menu').empty();
                self.run();
            });
        });
    };

    TempRunLvl1.prototype.run = function() {

        var gameHolder = $('#game');
        gameHolder.load("src/html/game.html", function (response) {
            var canvas = document.createElement('canvas');
            canvas.width = 1000;
            canvas.height = 600;
            canvas.id = 'canvas';
            $('#canvas-div').append(canvas);

            var myGameController = new GameController(canvas);
            myGameController.loadResources().then(function (response) {
                    myGameController.initializeGame(0, {});
                    myGameController.loop();
                },
                function (e) {
                    console.log("Game was not able to load resources...");
                }
            );
        });
    };

    return TempRunLvl1;
});
