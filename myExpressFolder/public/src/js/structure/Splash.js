define(['jquery','structure/FamilySearchHandler','structure/img/ImageManager', 'structure/util/Sig'],
    function($, FamilySearchHandler, ImageManager, Sig) {

    var Splash = function(FS)
    {
        console.log("THIS IS THE WRONG SPLASH OG:WIRH:OGHNW:OGIH:WOIRG");
        this.gameController = new GameController();
        this.viewController = new ViewController(this.gameController);
        this.viewController.init();
        ImageManager.launch();

        this.familySearchHandler = new FamilySearchHandler(FS);

    };

    Splash.prototype.init = function()
    {
        var self =  this;
        var tempObj = [];
        tempObj["FS"] = this.familySearchHandler;
        var loadSplashEvent = new Sig(Sig.LD_INTFC, Sig.SP_INTFC, tempObj);
        this.viewController.handle(loadSplashEvent);
        this.familySearchHandler.checkAccessToken(function(eightGens){
            if (eightGens || true)
            {
                console.log("we are now starting up the Commander", eightGens);
                //if we got family search data back then start up the commander
                self.commander = new Commander(self.viewController, ImageManager, eightGens, self.gameController);
                self.commander.start();
            }
        });

    };

    return Splash;
});
