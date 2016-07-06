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


    PanelManager.prototype.loadResource = function(containerID, url, type, value, onSuccess){
        var self = this;
        var container = $(containerID);
        container.empty();
        container.load(url, function(response){
            if (response){
                if(onSuccess){
                    onSuccess();
                }
                self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.DEFT_PNL, ["success"]));
            }
            else{
                self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.DEFT_PNL, ["failure"]));
            }
        });
    };

    PanelManager.prototype.loadSplashInterface = function(event){
        var self = this;
        var loadLocation = $('#menu');
        loadLocation.empty();

        loadLocation.load("src/html/splash.html", function(response) {
            if(response) {
                event.data.push("success");
                self.viewController.handle(new GEvent(GEvent.INTFC_LD, GEvent.SP_INTFC, event.data));
            }
            else {
                //epic fail!!!!!!!!!!!!!!
            }
        });
    };

    PanelManager.prototype.loadMainMenuInterface = function(event){
        this.loadResource('#menu', 'src/html/mainmenu.html', GEvent.INTFC_LD, event.value, null);
    };

    PanelManager.prototype.loadGameInterface = function(event){
        this.loadResource('#menu', 'src/html/game.html', GEvent.INTFC_LD, event.value, function(){
            var canvas = document.createElement('canvas');
            canvas.width = 1000;
            canvas.height = 600;
            canvas.id = 'canvas';
            $('#canvas-div').append(canvas);
        });
    };

    PanelManager.prototype.loadLevelSelectorInterface = function(event){
        var self = this;
        var container = $('#game');
        container.empty();
        container.load("src/html/levelsinterface.html", function (response) {
            if(response) {
                self.viewController.handle(new GEvent(GEvent.INTFC_LD, event.value, ['success']));
            }
            else{
                self.viewController.handle(new GEvent(GEvent.INTFC_LD, event.value, ['failure']));
            }
        });
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
        this.loadResource('#sidebar', "src/html/indexers.html", null);
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
        this.loadResource('#sidebar', "src/html/victory.html", GEvent.SDBAR_LD, GEvent.VTRY_PNL, null);
        //var self = this;
        //var sidebarContainer = $('#sidebar');
        //sidebarContainer.empty();
        //sidebarContainer.load("src/html/victory.html", function(response){
        //    if (response){
        //      self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.VTRY_PNL, ["success"]));
        //    }
        //    else{
        //        self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.VTRY_PNL, ["failure"]));
        //    }
        //});
    };

    PanelManager.prototype.loadDefeatSideBar = function(){
        this.loadResource('#sidebar', "src/html/defeat.html", GEvent.SDBAR_LD, GEvent.DEFT_PNL, null);
        //var self = this;
        //var sidebarContainer = $('#sidebar');
        //sidebarContainer.empty();
        //sidebarContainer.load("src/html/defeat.html", function(response){
        //    if (response){
        //      self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.DEFT_PNL, ["success"]));
        //    }
        //    else{
        //        self.viewController.handle(new GEvent(GEvent.SDBAR_LD, GEvent.DEFT_PNL, ["failure"]));
        //    }
        //});
    };

    PanelManager.prototype.loadBlankSideBar = function(){
        var self = this;
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
    };


    return PanelManager;

});
