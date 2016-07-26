/**
 * Created by calvin on 7/26/16.
 */

define(["util/Sig", "LevelDefinition"],function(Sig, LevelDefinition){

    function GameEventManager(controller){
        this.controller = controller;
    }

    GameEventManager.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case Sig.CMND_ACT:          self.controller.handle(event);                                          break;
            case Sig.ST_CLICK:          self.setClickContext(event);                                            break;
            case Sig.BTN_ACTN:
                switch (event.value) {
                    case Sig.NEXT_BTN:  self.nextLevelButtonClicked();                                          break;
                    case Sig.AGAN_BTN:  self.playAgainButtonClicked();                                          break;
                    case Sig.MENU_BTN:  self.mainMenuButtonClicked();                                           break;
                    case Sig.STRT_BTN:  self.startButtonClicked();                                              break;
                }
                break;
            case Sig.LD_MODAL:
                switch (event.value){
                    case Sig.ANC_INFO:  self.controller.handle(event);                                          break;
                }
                break;
            case Sig.CNVS_CLK:          self.handleCanvasClick(event);                                          break;

        }
    };

    /**
     * Changes the context that controls what happens when the user clicks on the main board.
     * @param event - See [Sig.js]
     */
    EventManager.prototype.setClickContext = function(event) {
        var self = this;
        switch(event.value){
            case Sig.STAN_BLD:
                //console.log("set context to standardBuilding");
                self.clickContext = {elementType:"building", class:"standardBuilding", cost:20};
                break;
            case Sig.LIBR_BLD:
                //console.log("set context to library");
                self.clickContext = {elementType:"building", class:"library", cost:30};
                break;
            case Sig.STAN_IDX:
                //console.log("set context to standardIndexer");
                self.clickContext = {elementType:"indexer", class:"standardIndexer", cost:20};
                break;
            case Sig.HOBB_IDX:
                //console.log("set context to hobbyist");
                self.clickContext = {elementType:"indexer", class:"hobbyist", cost:30};
                break;
            case Sig.UBER_IDX:
                //console.log("set context to hobbyist");
                self.clickContext = {elementType:"indexer", class:"uber", cost:0};
                break;
            case Sig.SPCL_IDX:
                self.clickContext = {elementType:"indexer", class:"specialist", cost:30};
                break;
        }
    };

    /**
     * Handler for when the start button is clicked
     */
    EventManager.prototype.startButtonClicked = function()
    {
        this.controller.handle(new Sig(Sig.CMND_ACT, Sig.STRT_BTN));
    };

    /**
     * The next level button click handler
     */
    EventManager.prototype.nextLevelButtonClicked = function()
    {
        this.controller.handle(new Sig(Sig.UPD_USER, Sig.LVL_VCTR));    // Save
        this.controller.handle(new Sig(Sig.LD_TPBAR, Sig.GM_TPBAR));    // Change the interface
        this.controller.handle(new Sig(Sig.LD_SDBAR, Sig.BLNK_PNL));
        this.controller.handle(new Sig(Sig.LVL_CMND, Sig.STRT_LVL));    // Continue
        // var levelToLoad = LevelDefinition.getNextSceneInfo(this.controller.currentAct, this.controller.currentScene);
        // this.controller.initializeGame(levelToLoad.act, levelToLoad.scene, {});
        // this.controller.loop();
    };

    EventManager.prototype.playAgainButtonClicked = function()
    {
        this.controller.handle(new Sig(Sig.UPD_USER, Sig.LVL_DEFT));    // Save
        this.controller.handle(new Sig(Sig.LD_TPBAR, Sig.GM_TPBAR));    // Change the interface
        this.controller.handle(new Sig(Sig.LD_SDBAR, Sig.BLNK_PNL));
        this.controller.handle(new Sig(Sig.LVL_CMND, Sig.STRT_LVL));    // Continue
        // this.controller.initializeGame(this.controller.currentAct, this.controller.currentScene, {}); // replay level.
        // this.controller.loop();
    };

    EventManager.prototype.mainMenuButtonClicked = function()
    {
        location.reload();
    };
});