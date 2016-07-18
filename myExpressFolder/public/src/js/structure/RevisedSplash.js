define(['jquery','structure/FamilySearchHandler','structure/img/ImageManager', 'structure/util/Sig',
    'structure/view/ViewController', 'structure/Commander'],
    function($, FamilySearchHandler, ImageManager, Sig, ViewController, Commander) {

    var Splash = function(FS)
    {
        this.viewController = new ViewController();
        console.log("THIS IS THE WRONG SPLASH OG:WIRH:OGHNW:OGIH:WOIRG");
        this.viewController.init();

        this.familySearchHandler = new FamilySearchHandler(FS);
        this.controller = null;
    };

    Splash.prototype.init = function()
    {
        var self =  this;
        self.viewController.assign(self); // Assign the viewController to reference this page as it's lieutenant
        var tempObj = {};
        tempObj["FS"] = this.familySearchHandler;
        this.viewController.handle(new Sig(Sig.LD_INTFC, Sig.SP_INTFC, tempObj));
        this.familySearchHandler.checkAccessToken(function(eightGens){
            if (eightGens || true)
            {
                console.log("we are now starting up the Commander", eightGens);
                //if we got family search data back then sync the LoaderUtils and start up the Commander
                var imageManager = new ImageManager();
                imageManager.injectLoader(self.viewController.handle(new Sig(Sig.GET_LODR, Sig.HTM_LODR, null)));
                self.controller = new Commander(self.viewController, imageManager, self);
                self.controller.start(eightGens);
            }
        });

    };

    Splash.prototype.handle = function(event){
        switch(event.type){
            case Sig.SFAILURE:
                if(event.value == Sig.REC_FAIL){ // Event could be resolved by logging in again
                    console.log("Recoverable Failure.");
                    if(event.data.hasOwnProperty('report')) console.log(event.data.report);
                    
                    // Remove user credentials and ask to re-log in.
                }
                else if(event.value == Sig.CRT_FAIL){ // Connectivity Issues - logging in won't guarantee a resolution.
                    console.log("Critical Failure.");
                    if(event.data.hasOwnProperty('report')) console.log(event.data.report);
                    
                    // Remove user credentials and ask to come back later.
                }
                break;
        }
    };

    return Splash;
});
