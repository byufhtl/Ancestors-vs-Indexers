/**
 * Created by calvinmcm on 6/28/16.
 */

define(["jquery","GEvent"],function($,GEvent){

    function PanelManager(ViewController){
        this.viewController = ViewController;
    }

    PanelManager.prototype.init = function(event){

    };

    PanelManager.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case GEvent.LD_INTFC:
                switch (event.value){
                    case GEvent.SP_INTFC:
                        self.loadSplashInterface(event);
                        break;
                    case GEvent.MM_INTFC:
                        self.loadSplashInterface(event);
                        break;
                    case GEvent.GM_INTFC:
                        self.loadSplashInterface(event);
                        break;
                    case GEvent.LV_INTFC:
                        self.loadSplashInterface(event);
                        break;
                    case GEvent.UG_INTFC:
                        self.loadSplashInterface(event);
                        break;
                }
                break;
            case GEvent.LD_TPBAR:                       // Load up a top bar
                switch (event.value){
                    case GEvent.GM_TPBAR:               //  - Load the game top bar
                        self.loadGameTopBar();
                        break;
                    case GEvent.BLNK_PNL:
                        self.loadBlankTopBar();
                }
                break;
            case GEvent.LD_SDBAR:                       // Load up a side bar
                switch (event.value){
                    case GEvent.BLDG_PNL:               //  - Load the Buildings Panel
                        self.loadBuildlingSideBar();
                        break;
                    case GEvent.INDX_PNL:               //  - Load the Indexers Panel
                        self.loadIndexersSideBar();
                        break;
                    case GEvent.VTRY_PNL:
                        self.loadVictorySideBar();
                        break;
                    case GEvent.DEFT_PNL:
                        self.loadDefeatSideBar();
                        break;
                    case GEvent.BLNK_PNL:
                        self.loadBlankSideBar();
                        break;
                }
        }
    };

    PanelManager.prototype.loadSplashInterface = function(event){

    };

    PanelManager.prototype.loadMainMenuInterface = function(event){
        var self = this;
        var container = $('#menu');
        container.empty();
        container.load('src/html/mainmenu.html', function (response){
            if(response){
                self.viewController.handle(new GEvent(GEvent.INTFC_LD, event.value, ['success']))
            }
            else{
                self.viewController.handle(new GEvent(GEvent.INTFC_LD, event.value, ['failure']))
            }
        });
    };

    PanelManager.prototype.loadGameInterface = function(event){

    };

    PanelManager.prototype.loadLevelSelectorInterface = function(event){

    };

    PanelManager.prototype.loadUpgradeManagerInterface = function(event){

    };

    PanelManager.prototype.loadGameTopBar = function(){
        var self = this;
        var topbarContainer = $('#topbar');
        topbarContainer.empty();
        topbarContainer.load("src/html/topbar.html", function (response) {
            if(response){
                self.viewController.handle(new GEvent(GEvent.TPBAR_LD, GEvent.GM_TPBAR, ["success"]));
            }
            else{
                self.viewController.handle(new GEvent(GEvent.TPBAR_LD, GEvent.GM_TPBAR, ["failure"]));
            }
        });
    };

    PanelManager.prototype.loadBlankTopBar = function(){
        var topbarContainer = $('#topbar');
        topbarContainer.empty();
    };

    PanelManager.prototype.loadBuildlingSideBar = function(){
        var self = this;
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
        sidebarContainer.load("src/html/buildings.html", function (response) {
            if(response){
                self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.BLDG_PNL, ["success"]));
            }
            else{
                self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.BLDG_PNL, ["failure"]));
            }
        });
    };

    PanelManager.prototype.loadIndexersSideBar = function(){
        var self = this;
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
        sidebarContainer.load("src/html/indexers.html", function (response) {
            if(response){
                self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.INDX_PNL, ["success"]));
            }
            else{
                self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.INDX_PNL, ["failure"]));
            }
        });
    }

    PanelManager.prototype.loadVictorySideBar = function(){
        var self = this;
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
        sidebarContainer.load("src/html/victory.html", function(response){
            if (response){
              self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.VTRY_PNL, ["success"]));
            }
            else{
                self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.VTRY_PNL, ["failure"]));
            }
        });
    }

    PanelManager.prototype.loadDefeatSideBar = function(){
        var self = this;
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
        sidebarContainer.load("src/html/defeat.html", function(response){
            if (response){
              self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.DEFT_PNL, ["success"]));
            }
            else{
                self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.DEFT_PNL, ["failure"]));
            }
        });
    };

    PanelManager.prototype.loadBlankSideBar = function(){
        var self = this;
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
    };


    return PanelManager;

});
