/**
 * Created by calvinmcm on 6/28/16.
 */

define(['jquery','util/Sig'], function($, Sig){

    function ButtonManager(viewController){
        this.viewController = viewController;
        this.sidebarButtons = [];
        this.topbarButtons = [];
        this.mainmenuButtons = [];
    }


    // UTILITY =======================================================================================================[]

    /**
     * Any basic setup that needs to happen after instantiation should happen here.
     */
    ButtonManager.prototype.init = function(){};

    /**
     * Kills any handlers on the buttons in the array passed in.
     * @param buttons
     */
    ButtonManager.prototype.killAll = function(buttons){
        for(var i in buttons){
            if(buttons.hasOwnProperty(i)){
                buttons[i].off('click');
            }
        }
        buttons = [];
    };

    /**
     * En/Dis-ables the active buttons.
     * @param disabled
     */
    ButtonManager.prototype.disableActive = function(disabled){
        for(var i in this.sidebarButtons){
            this.sidebarButtons[i].prop("disabled", disabled);
        }
        for(var j in this.topbarButtons){
            this.topbarButtons[j].prop("disabled", disabled);
        }
        for(var k in this.mainmenuButtons){
            this.mainmenuButtons[k].prop("disabled", disabled);
        }
    };


    // ENTRY POINTS ==================================================================================================[]
    /**
     * Handles a given event
     * @param event the event to be handled. See [Sig.js]
     */
    ButtonManager.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case Sig.INTFC_LD:
                switch(event.value){
                    case Sig.SP_INTFC:  self.loadLoginButton(event.data);                                       break;
                    case Sig.MM_INTFC:  self.loadMainMenuButtons(event.data);                                   break;
                    case Sig.GM_INTFC:  self.loadGameTopBarButtons(event.data);                                 break;
                }                                                                                               break;
            case Sig.TPBAR_LD:
                switch (event.value){
                    case Sig.GM_TPBAR:  self.loadGameTopBarButtons(event.data);                                 break;
                }                                                                                               break;
            case Sig.SDBAR_LD:
                switch (event.value){
                    case Sig.BLDG_PNL:  self.loadBuildingButtons(event.data);                                   break;
                    case Sig.INDX_PNL:  self.loadIndexerButtons(event.data);                                    break;
                    case Sig.DROP_PNL:  self.loadDropButtons(event.data);                                       break;
                    case Sig.VTRY_PNL:  self.loadVictoryButtons(event.data);                                    break;
                    case Sig.DEFT_PNL:  self.loadDefeatButtons(event.data);                                     break;
                }                                                                                               break;
            case Sig.MODAL_LD:
                                        self.loadAncDataModal(event.data);                                      break;
        }
    };


    // INTERFACE MANAGEMENT ==========================================================================================[]
    /**
     * Attaches the handlers for the login button on the app's sign-in page.
     * @param data the data object from the received request. Used to determine success status of HTML page load.
     */
    ButtonManager.prototype.loadLoginButton = function(data){
        var self = this;
        self.killAll(self.topbarButtons);
        var loginButton = $('#LOGIN');
        var loginButton2 = $('#LOGIN2');
        loginButton.click(function () {
            self.viewController.handle(new Sig(Sig.BTN_ACTN, Sig.LOGN_BTN, data));
        });
        loginButton2.click(function () {
            loginButton.click();
        });
    };

    /**
     * Attaches the handlers for the buttons on the app's main menu page
     * @param data the data object from the received request. Used to determine success status of HTML page load.
     */
    ButtonManager.prototype.loadMainMenuButtons = function(data){
        var self = this;
        self.killAll(self.mainmenuButtons);

        var upgradesButton = $('#manage-upgrades');
        var levelsButton = $('#manage-level');
        var startGameButton = $('#start-game');
        self.mainmenuButtons.push(upgradesButton, levelsButton, startGameButton);

        upgradesButton.click(function(){
            self.viewController.handle(new Sig(Sig.LD_INTFC, Sig.UG_INTFC, data));
        });
        levelsButton.click(function(){
            self.viewController.handle(new Sig(Sig.LD_INTFC, Sig.LV_INTFC, data));
        });
        startGameButton.click(function(){
            self.viewController.handle(new Sig(Sig.LD_INTFC, Sig.GM_INTFC, data));
        });
    };

    /**
     * Attaches the handlers for the buttons on the game's top bar
     * @param data the data object from the received request. Used to determine success status of HTML page load.
     */
    ButtonManager.prototype.loadGameTopBarButtons = function (data) {
        var self = this;
        self.killAll(self.topbarButtons);

        var structures_button = $('#structures-button');
        var indexers_button = $('#indexers-button');
        var drops_button = $('#drops-button');

        self.topbarButtons = [structures_button, indexers_button];

        structures_button.click(function () {
            self.viewController.handle(new Sig(Sig.LD_SDBAR, Sig.BLDG_PNL, data));
        });

        indexers_button.click(function () {
            self.viewController.handle(new Sig(Sig.LD_SDBAR, Sig.INDX_PNL, data));
        });

        drops_button.click(function() {
            self.viewController.handle(new Sig(Sig.LD_SDBAR, Sig.DROP_PNL, data));
        })
    };


    // PANEL MANAGEMENT ==============================================================================================[]
    /**
     * Loads the handlers for the building buttons in the sidebar
     */
    ButtonManager.prototype.loadBuildingButtons = function (data) {
        var self = this;
        self.killAll(self.sidebarButtons);

        var button_1 = $('#button-1');
        var button_2 = $('#button-2');
        var button_1_image = $('#button-1-img');
        var button_2_image = $('#button-2-img');

        self.sidebarButtons.push(button_1, button_2, button_1_image, button_2_image);

        button_1.click(function () {
            //console.log("Button 1 Clicked!");
            self.viewController.handle(new Sig(Sig.ST_CLICK, Sig.STAN_BLD, []));
        });
        button_2.click(function () {
            //console.log("Button 2 Clicked!");
            self.viewController.handle(new Sig(Sig.ST_CLICK, Sig.LIBR_BLD, []));
        });
        button_1_image.click(function () {
            button_1.click()
        });
        button_2_image.click(function () {
            button_2.click()
        });
    };

    /**
     * Loads the handlers for the indexers buttons in the sidebar.
     */
    ButtonManager.prototype.loadIndexerButtons = function (data) {
        console.log("loading clickevents for loadIndexerButtons");
        var self = this;
        self.killAll(self.sidebarButtons);
        var button_1 = $('#button-1-i');
        var button_2 = $('#button-2-i');
        var button_3 = $('#button-3-i');
        var button_4 = $('#button-4-i');
        var button_1_image = $('#button-1-img-i');
        var button_2_image = $('#button-2-img-i');
        var button_3_image = $('#button-3-img-i');
        var button_4_image = $('#button-4-img-i');
        console.log("button 1 is: ", button_1);
        self.sidebarButtons.push(button_1, button_2, button_1_image, button_2_image);

        button_1.click(function () {
            console.log("clicked standIndexer btuton");
            self.viewController.handle(new Sig(Sig.ST_CLICK, Sig.STAN_IDX, {}));
        });
        button_2.click(function () {
            //console.log("Button 2i Clicked!");
            self.viewController.handle(new Sig(Sig.ST_CLICK, Sig.HOBB_IDX, {}));
        });
        button_3.click(function () {
            //console.log("Button 3i Clicked!");
            self.viewController.handle(new Sig(Sig.ST_CLICK, Sig.UBER_IDX, {}));
        });
        button_4.click(function () {
            //console.log("Button 4i Clicked!");
            self.viewController.handle(new Sig(Sig.ST_CLICK, Sig.RSCH_IDX, {}));
        });
        button_1_image.click(function () {
            button_1.click()
        });
        button_2_image.click(function () {
            button_2.click()
        });
        button_3_image.click(function () {
            button_3.click()
        });
        button_4_image.click(function () {
            button_4.click()
        });
    };

    ButtonManager.prototype.loadDropButtons = function (data) {
        var self = this;
        self.killAll(self.sidebarButtons);
        var button_1 = $('#button-1-i');

        var button_1_image = $('#button-1-img-i');

        self.sidebarButtons.push(button_1);

        button_1.click(function () {
            console.log("clicked standIndexer btuton");
            self.viewController.handle(new Sig(Sig.ST_CLICK, Sig.STRY_DRP, {}));
        });

        button_1_image.click(function () {
            button_1.click()
        });
    };

    ButtonManager.prototype.loadVictoryButtons = function (data) {
        var self = this;
        self.killAll(self.sidebarButtons);

        var nextLevelButton = $('#nextLevelButton');
        var mainMenuButton = $('#mainMenuButton');
        nextLevelButton.click(function () {
            self.viewController.handle(new Sig(Sig.BTN_ACTN, Sig.NEXT_BTN));
        });

        mainMenuButton.click(function () {
            self.viewController.handle(new Sig(Sig.BTN_ACTN, Sig.MENU_BTN));
        })
    };

    ButtonManager.prototype.loadDefeatButtons = function (data) {
        var self = this;
        self.killAll(self.sidebarButtons);
        var nextLevelButton = $('#playAgainButton');
        var mainMenuButton = $('#mainMenuButton');
        nextLevelButton.click(function () {
            self.viewController.handle(new Sig(Sig.BTN_ACTN, Sig.AGAN_BTN));
        });

        mainMenuButton.click(function () {
            self.viewController.handle(new Sig(Sig.BTN_ACTN, Sig.MENU_BTN));
        });
    };


    // MODAL MANAGEMENT ==============================================================================================[]
    /**
     * Supa broken and doesn't belong in the button manager in its current state.
     */
    ButtonManager.prototype.loadAncDataModal = function (data){
        $('#xButton').click(function(event) {
            data.modal('hide');
            if (info[indexToShow + 1] != null)
            {
                var showAncestorInfoEvent = new Sig(Sig.LD_MODAL, Sig.ANC_INFO, [indexToShow + 1]);
                self.controller.handle(showAncestorInfoEvent);
            }

        });
    };

    return ButtonManager;

});
