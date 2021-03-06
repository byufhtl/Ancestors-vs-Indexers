define(['jquery','ViewController','ImageManager', '../../myExpressFolder/public/structure/src/js/FamilySearchHandler', 'GameController', 'GEvent', '../../myExpressFolder/public/structure/src/js/Commander'],
    function($, ViewController, ImageManager, FamilySearchHandler, GameController, GEvent, Commander) {

    var Splash = function(FS)
    {
        this.gameController = new GameController();
        this.viewController = new ViewController(this.gameController);
        this.viewController.init();
        ImageManager.launch();
        
        this.familySearchHandler = new FamilySearchHandler(FS);

    };

    Splash.prototype.init = function()
    {
        var self =  this;
        var tempArray = [];
        tempArray.push(this.familySearchHandler);
        var loadSplashEvent = new GEvent(GEvent.LD_INTFC, GEvent.SP_INTFC, tempArray);
        this.viewController.handle(loadSplashEvent);
        this.familySearchHandler.checkAccessToken(function(eightGens){
            if (eightGens || 1)
            {
                console.log("we are now startign up the Commander", eightGens);
                //if we got family search data back then start up the commander
                self.controller = new Commander(self.viewController, ImageManager, eightGens, self.gameController);
                self.controller.start();
            }
        });

    };

    return Splash;
});
