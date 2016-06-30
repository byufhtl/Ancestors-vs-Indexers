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
            case GEvent.LD_TPBAR:                       // Load up a top bar
                switch (event.value){
                    case GEvent.GM_TPBAR:               //  - Load the game top bar
                        self.loadGameTopBar();
                        break;
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
                }
        }
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

    PanelManager.prototype.loadBuildlingSideBar = function(){
        var self = this;
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
        sidebarContainer.load("src/html/buildings.html", function (response) {
            console.log((response) ? ("Buildings sidebar loaded,") : ("Buildings sidebar did not load."));
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
            console.log((response) ? ("Indexers sidebar loaded,") : ("Indexers sidebar did not load."));
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
        var sideBarContainer = $('#sidebar');
        sidebarContainer.empty();
        sidebarContainer.load("src/html/victory.html", function(response){
            console.log((response) ? ("Buildings sidebar loaded with response: " + response) : ("Buildings sidebar loaded with no response."));
            $('#nextLevelButton').click(function(){
                console.log("PUSHED NEXT LEVEL BUTTON");
                controller.initializeGame((controller.currentLevel + 1), {});
                controller.loop();
            });
            $('#mainMenuButton').click(function(){
                location.reload();
            });
        });
    }

    return PanelManager;

});
