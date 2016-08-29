define(['jquery','FamilySearchHandler','img/ImageManager', 'util/Sig',
    'view/ViewController', 'Commander', 'util/Order', 'game/Board'],
    function($, FamilySearchHandler, ImageManager, Sig, ViewController, Commander, Order, Board) {

    var Splash = function(FS)
    {
        this.viewController = new ViewController();
        this.viewController.init();

        this.familySearchHandler = new FamilySearchHandler(FS);
        this.controller = null;
    };

    Splash.prototype.init = function()
    {
        var testBoard = new Board();
        testBoard.generate({numDBs: 8, numExtraClumps: 7, numLocked: 0, clumpiness: 25});
        console.log("<<BOARD>> Print Test:");
        testBoard.printTest();
        console.log("<<BOARD>> --End Print Test");
        var self =  this;
        var request = new Order();
        request.addItem("src/html/loadingPage.html", Order.HTML, 15);
        self.viewController.htmlManager.loader.loadResources(request).then(function(successResponse){


            self.viewController.assign(self); // Assign the viewController to reference this page as it's lieutenant
            var tempObj = {};
            self.viewController.handle(new Sig(Sig.LD_INTFC, Sig.LD_INTFC, tempObj));

            self.familySearchHandler.checkAccessToken(function(eightGens){
                if (eightGens)
                {
                    //if we got family search data back then sync the LoaderUtils and start up the Commander
                    var imageManager = new ImageManager();
                    imageManager.injectLoader(self.viewController.handle(new Sig(Sig.GET_LODR, Sig.HTM_LODR, null)));
                    self.controller = new Commander(imageManager, self.viewController, self);
                    self.controller.start(eightGens, self.familySearchHandler.user);
                    self.__tempCheckUser();
                }
                else {
                    tempObj["FS"] = this.familySearchHandler;
                    console.log("loading the splash page");
                    self.viewController.handle(new Sig(Sig.LD_INTFC, Sig.SP_INTFC, tempObj));
                    self.__tempCheckUser();
                }
            });
        });
    };

    Splash.prototype.__tempCheckUser = function(){
        // =============================================================================================================
        // JUST CHECKING THIS BIT OF CODE REALLY FAST vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        var self = this;
        self.familySearchHandler.scanUser(function success(history){
            self.familySearchHandler.getCurrentUser().then(function(user){
                if(user) {
                    console.log("<<SPLASH - TEMP>> User:", user);
                    var userChanges = [];
                    var checked  = 0;
                    var len = history.entries.length;
                    var updateUser = function(changes){
                        for(var change of changes){
                            console.log("User's points increase by 10.")
                        }
                    };
                    for (var entry of history.entries) {
                        self.familySearchHandler.matchPersonChangeHistory(entry, user).then(
                            function success(response){
                                userChanges.push(response);
                                if(++checked == len){
                                    updateUser(userChanges);
                                }
                            }
                            ,function failure(response){
                                if(++checked == len){
                                    updateUser(userChanges);
                                }
                            }
                        );
                    }
                }
            });

        });
        // END TEMP CODE ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // =============================================================================================================
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
            case Sig.BTN_ACTN:
                switch(event.value){
                    case Sig.LOGN_BTN:
                        this.familySearchHandler.login();
                        break;
                    // Other splash page buttons.
                }
                break;
        }
    };

    return Splash;
});
