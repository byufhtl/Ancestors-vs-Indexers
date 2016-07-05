define(['jquery','ViewController','ImageManager', 'FamilySearchHandler'],function($, ViewController, ImageManager, FamilySearchHandler) {

    var Splash = function()
    {
        this.viewController = new ViewController(this);
        this.viewController.init();
        this.imageManager = new ImageManager();
        this.imageManager.launch();
        this.familySearch = new FamilySearch;
    };

    splash.prototype.init = function()
    {
        var tempArray = [];
        tempArray.push(this.familySearch)
        var loadSplashEvent = new GEvent(GEvent.LD_INTFC, GEvent.SP_INTFC, tempArray);
        this.ViewController.handle(loadSplashEvent);
    };

    return Splash;
});
