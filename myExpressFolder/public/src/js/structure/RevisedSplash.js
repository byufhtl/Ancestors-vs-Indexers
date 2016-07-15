define(['jquery','structure/FamilySearchHandler','structure/img/ImageManager', 'structure/util/Sig',
    'structure/view/ViewController', 'structure/Commander'],
    function($, FamilySearchHandler, ImageManager, Sig, ViewController, Commander) {

    var Splash = function(FS)
    {
        this.viewController = new ViewController();
        console.log("THIS IS THE WRONG SPLASH OG:WIRH:OGHNW:OGIH:WOIRG");
        this.viewController.init();

        this.familySearchHandler = new FamilySearchHandler(FS);
        this.commander = null;
    };

    Splash.prototype.init = function()
    {
        var self =  this;
        self.viewController.assign(self); // Assign the viewController to reference this page as it's lieutenant
        var tempObj = [];
        tempObj["FS"] = this.familySearchHandler;
        var loadSplashEvent = new Sig(Sig.LD_INTFC, Sig.SP_INTFC, tempObj);
        this.viewController.handle(loadSplashEvent);
        this.familySearchHandler.checkAccessToken(function(eightGens){
            if (eightGens || true)
            {
                console.log("we are now starting up the Commander", eightGens);
                //if we got family search data back then sync the LoaderUtils and start up the Commander
                var imageManager = new ImageManager();
                imageManager.injectLoader(self.viewController.handle(new Sig(Sig.GET_LODR, Sig.HTM_LODR, null)));
                self.commander = new Commander(self.viewController, imageManager);
                self.commander.start(eightGens);
            }
        });

    };

    return Splash;
});
