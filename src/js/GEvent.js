/**
 * Created by calvinmcm on 6/28/16.
 */

define([],function(){

    /**
     * A simple way to handle event standardization between all of the various things that will need them.
     * @param type
     * @param value
     * @param data
     * @constructor
     */
    function GEvent(type, value, data){
        this.type = type;
        this.value = value;
        this.data = data; // An array of data
    }

    // INTERFACES ==============================================================================[]>
    GEvent.LD_INTFC = "load_interface";     // Signal for loading an interface
    GEvent.INTFC_LD = "interface_loaded";   // Signal for interface loaded

    GEvent.SP_INTFC = "splash_interface";   // The standard splash interface
    GEvent.MM_INTFC = "main_menu_interface";// The main menu interface
    GEvent.GM_INTFC = "game_interface";     // The standard game interface
    GEvent.LV_INTFC = "level_interface";    // The standard level selecting interface
    GEvent.UG_INTFC = "upgrade_interface";  // The standard upgrade management interface

    // TOP BARS ================================================================================[]>
    GEvent.LD_TPBAR = "load_topbar";        // Signal for topbar needing loaded
    GEvent.TPBAR_LD = "topbar_loaded";      // Signal for topbar HTML loaded

    GEvent.GM_TPBAR = "game_top_bar";       // Game Top Bar

    // SIDE BARS ===============================================================================[]>
    GEvent.LD_SDBAR = "load_sidebar";       // Signal for sidebar needing loaded
    GEvent.SDBAR_LD = "sidebar_loaded";     // Signal for sidebar HTML loaded

    GEvent.BLDG_PNL = "building_panel";     // Building Panel
    GEvent.INDX_PNL = "indexer_panel";      // Indexer Panel
    GEvent.BLNK_PNL = "blank_panel";        // Load a blank panel

    GEvent.ST_CLICK = "set_click";          // Signal what should happen on a click event.

    // CANVAS SKINS ============================================================================[]>
    GEvent.VTRY_PNL = "victory_panel";      // Victory Panel
    GEvent.DEFT_PNL = "defeat_panel";       // Defeat Panel

    // CLICKING ================================================================================[]>
    GEvent.CNVS_CLK = "canvas_click";       // The canvas click event type
    GEvent.CNVS_DRG = "canvas_drag";        // The canvas drag event type


    // BUTTON SIGNALS ==========================================================================[]>
    GEvent.BTN_ACTN = "button_action";      // Button Action

    GEvent.NEXT_BTN = "next_level_button";  // Next Level Button
    GEvent.AGAN_BTN = "play_again_button";  // Play Level Again Button
    GEvent.MENU_BTN = "menu_button";        // Menu Button

    GEvent.STAN_BLD = "standard_building";  // The standard type of building
    GEvent.LIBR_BLD = "library_building";   // The library type of building

    GEvent.STAN_IDX = "standard_indexer";   // The standard type of indexer
    GEvent.HOBB_IDX = "hobbyist_indexer";   // The hobbyist type of indexer
    GEvent.UBER_IDX = "uber_indexer";       // The unbeatable type of indexer

    return GEvent;
});
