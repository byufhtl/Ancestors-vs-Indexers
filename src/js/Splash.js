define(['jquery','ViewController','ImageManager', 'FamilySearchHandler', 'GameController', 'GEvent'],function($, ViewController, ImageManager, FamilySearchHandler, GameController, GEvent) {

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
       
        var tempArray = [];
        tempArray.push(this.familySearchHandler);
        var loadSplashEvent = new GEvent(GEvent.LD_INTFC, GEvent.SP_INTFC, tempArray);
        this.viewController.handle(loadSplashEvent);
        if (this.familySearchHandler.checkAccessToken())
        {
            //var loadCommanderEvent = new GEvent(GEvent, )
        }
    };

    return Splash;
});
