/**
 * Created by calvin on 7/8/16.
 * HTMLManager
 *
 * This class is used to load the HTML fragments that are used in the game.
 * The .handle() function serves as the primary event-driven access point for the class.
 * Makes use of the LoaderUtils class to generate and save the HTML elements for incremental element loading with
 * quicker repeat loading via the saving functionality in the LoaderUtils class.
 */

define(['jquery','structure/util/Sig','structure/util/LoaderUtils','structure/util/Order'],function($, Sig, LoaderUtils, Order){

    /**
     * The main constructor for the class. Makes sure to hold on to the viewController and the LoaderUtils object.
     * @param viewController
     * @constructor
     */
    function HTMLManager(viewController){
        this.viewController = viewController;
        this.loader = new LoaderUtils();
    }

    // ENTRY POINTS ====================================================================================================

    /**
     * Allows for a different LoaderUtils to be loaded, allowing us to take full advantage of prior file saving.
     * @param loader
     */
    HTMLManager.prototype.injectLoader = function(loader){
        this.loader = loader;
    };

    /**
     * Allows the LoaderUtils for this class to be extracted and stored externally, allowing us to preserve loaded
     * files across several instances of the HTMLManager class if properly handled.
     * @returns {*}
     */
    HTMLManager.prototype.extractLoader = function(){
        return this.loader;
    };

    /**
     * The primary event handler function for the class.
     * @param event
     */
    HTMLManager.prototype.handle = function(event){
        switch(event.type){
            case Sig.LD_INTFC:
                this.setInterface(event.value);
                break;
            case Sig.LD_TPBAR:
                this.setTopBar(event.value);
                break;
            case Sig.LD_SDBAR:
                this.setSidebar(event.value);
                break;
        }
    };

    // INTERFACE LOADING ===============================================================================================

    /**
     * Clears out and returns the content div.
     * @returns {*|jQuery|HTMLElement}
     */
    HTMLManager.getMainDiv = function(){
        var content = $('#content');
        content.empty();
        return content;
    };

    /**
     * Loads up a specified interface, placing it in the main content div if the resource was able to be loaded.
     * On successful load, queues a successful load event in the ViewManager. Otherwise queues a failed load event.
     * @param url
     * @param value
     */
    HTMLManager.prototype.loadInterface = function(url, value){
        var content = HTMLManager.getMainDiv();
        var self = this;
        var request = new Order();
        request.addItem(url, Order.HTML, 15);
        self.loader.loadResources(request).then(
            function(successResponse) {
                content.html(self.loader.getResource(url));
                console.log('This ought to be a div container with the stuff in it:', successResponse);
                self.viewController.handle(new Sig(Sig.INTFC_LD, value, {success:Sig.LD_SCESS}));
            },
            function(failureResponse){
                self.viewController.handle(new Sig(Sig.INTFC_LD, value, {success:Sig.LD_FAILD, response:failureResponse}));
            }
        );
    };

    /**
     * Route splitter for interface loading events. Plugs in URL's and response codes.
     * @param value
     */
    HTMLManager.prototype.setInterface = function(value){
        var self = this;
        switch(value){
            case Sig.SP_INTFC:
                self.loadInterface("src/html/splash.html", value);
                break;
            case Sig.MM_INTFC:
                self.loadInterface("src/html/mainmenu.html", value);
                break;
            case Sig.GM_INTFC:
                self.loadInterface("src/html/game.html", value);
                break;
            case Sig.LV_INTFC:
                self.loadInterface("src/html/levelsinterface.html", value);
                break;
            case Sig.UG_INTFC:
                self.loadInterface("src/html/upgradesinterface.html", value);
                break;
        }
    };

    // TOPBAR LOADING ==================================================================================================

    /**
     * Clears out and returns the topbar div in the game.html fragment.
     * @returns {*|jQuery|HTMLElement}
     */
    HTMLManager.getTopBarDiv = function(){
        var content = $('#topbar');
        content.empty();
        return content;
    };

    /**
     * Loads up a specified top bar, placing it in the game's topbar div if the resource was able to be loaded.
     * On successful load, queues a successful load event in the ViewManager. Otherwise queues a failed load event.
     * @param url
     * @param value
     */
    HTMLManager.prototype.loadTopBar = function(url, value){
        var self = this;
        var bardiv = HTMLManager.getTopBarDiv();
        var request = new Order();
        request.addItem(url,Order.HTML, 15);
        self.loader.loadResources(request.getBatches()).then(
            function(resolved){
                bardiv.html(self.loader.getResource(url));
                console.log('This ought to be a div container with the stuff in it:', resolved);
                self.viewController.handle(new Sig(Sig.TPBAR_LD, value, {success:Sig.LD_SCESS}));
            },
            function(rejected){
                self.viewController.handle(new Sig(Sig.TPBAR_LD, value, {success:Sig.LD_FAILD, response:rejected}));
            }
        )
    };

    /**
     * Route splitter for topbar loading events. Plugs in URL's and response codes.
     * @param value
     */
    HTMLManager.prototype.setTopBar = function(value){
        var self = this;
        switch(value){
            case Sig.GM_TPBAR:
                self.loadTopBar("src/html/topbar.html", value);
                break;
            case Sig.EM_TPBAR:
                HTMLManager.getTopBarDiv();
                break;
        }
    };

    // SIDEBAR LOADING =================================================================================================

    /**
     * Clears out and returns the sidebar div in the game.html fragment.
     * @returns {*|jQuery|HTMLElement}
     */
    HTMLManager.getSidebarDiv = function(){
        var content = $('#sidebar');
        content.empty();
        return content;
    };

    /**
     * Loads up a specified top bar, placing it in the game's topbar div if the resource was able to be loaded.
     * On successful load, queues a successful load event in the ViewManager. Otherwise queues a failed load event.
     * @param url
     * @param value
     */
    HTMLManager.prototype.loadSidebar = function(url, value){
        var self = this;
        var bardiv = HTMLManager.getSidebarDiv();
        var request = new Order();
        request.addItem(url,Order.HTML, 15);
        self.loader.loadResources(request.getBatches()).then(
            function(resolved){
                bardiv.html(self.loader.getResource(url));
                console.log('This ought to be a div container with the stuff in it:', resolved);
                self.viewController.handle(new Sig(Sig.TPBAR_LD, value, {success:Sig.LD_SCESS}));
            },
            function(rejected){
                self.viewController.handle(new Sig(Sig.TPBAR_LD, value, {success:Sig.LD_FAILD, response:rejected}));
            }
        )
    };

    /**
     * Route splitter for topbar loading events. Plugs in URL's and response codes.
     * @param value
     */
    HTMLManager.prototype.setSidebar = function(value){
        var self = this;
        switch(value){
            case Sig.BLDG_PNL:
                self.loadSidebar("src/html/buildings.html", value);
                break;
            case Sig.INDX_PNL:
                self.loadSidebar("src/html/indexers.html", value);
                break;
            case Sig.VTRY_PNL:
                self.loadSidebar("src/html/victory.html", value);
                break;
            case Sig.DEFT_PNL:
                self.loadSidebar("src/html/defeat.html", value);
                break;
        }
    };

    // =================================================================================================================

    return HTMLManager;
});