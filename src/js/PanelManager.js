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
                        self.loadMainMenuInterface(event);
                        break;
                    case GEvent.GM_INTFC:
                        self.loadGameInterface(event);
                        break;
                    case GEvent.LV_INTFC:
                        self.loadLevelSelectorInterface(event);
                        break;
                    case GEvent.UG_INTFC:
                        self.loadUpgradeManagerInterface(event);
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
            var status = "failure";
            if (response){
                if(onSuccess){ onSuccess();}
                status = "success";
            }
            self.viewController.handle(new GEvent(type, value, [status]));
        });
    };

    PanelManager.prototype.loadSplashInterface = function(event){
        var self = this;
        var loadLocation = $('#content');
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
    /*
    PanelManager.prototype.loadMainMenuInterface = function(event){
        var self = this;
        var loadLocation = $('#content');
        loadLocation.empty();

        loadLocation.load("src/html/mainmenu.html", function(response) {
            if(response) {
                self.viewController.handle(new GEvent(GEvent.INTFC_LD, GEvent.MM_INTFC, event.data));
            }
            else {
                //epic fail!!!!!!!!!!!!!!
            }
        });
    };
    */

    PanelManager.prototype.loadMainMenuInterface = function(event){
        this.loadResource('#content', 'src/html/mainmenu.html', GEvent.INTFC_LD, event.value, null);
    };

    PanelManager.prototype.loadGameInterface = function(event){var self = this;
        console.log('loading game interface');
        $('#content').empty();
        var container = $('#content');
        container.empty();
        container.load("src/html/game.html", function(response){
            if (response){

                self.handle(new GEvent(GEvent.LD_TPBAR, GEvent.GM_TPBAR, []));
                self.viewController.handle(new GEvent(GEvent.CMND_ACT, GEvent.STRT_BTN, []));
            }
            else{
                self.viewController.handle(new GEvent(GEvent.INTFC_LD, event.value, ["failure"]));
            }
        });

    };

    PanelManager.prototype.loadLevelSelectorInterface = function(event){
        this.loadResource('#content', 'src/html/levelsinterface.html', GEvent.INTFC_LD, event.value, null);
    };

    PanelManager.prototype.loadUpgradeManagerInterface = function(event){
        this.loadResource('#content', 'src/html/upgradesinterface.html', GEvent.INTFC_LD, event.value, null);
    };

    PanelManager.prototype.loadGameTopBar = function(){
        this.loadResource('#topbar', 'src/html/topbar.html', GEvent.TPBAR_LD, GEvent.GM_TPBAR, null);
    };

    PanelManager.prototype.loadBlankTopBar = function(){
        var topbarContainer = $('#topbar');
        topbarContainer.empty();
    };

    PanelManager.prototype.loadBuildlingSideBar = function(){
        this.loadResource('#sidebar', 'src/html/buildings.html', GEvent.SDBAR_LD, GEvent.BLDG_PNL, null);
    };

    PanelManager.prototype.loadIndexersSideBar = function(){
        this.loadResource('#sidebar', "src/html/indexers.html", GEvent.SDBAR_LD, GEvent.INDX_PNL, null);
    };

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
