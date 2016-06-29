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

    GEvent.SDBAR_LD = "sidebar_loaded";     // Signal for sidebar HTML loaded
    GEvent.TPBAR_LD = "topbar_loaded";      // Signal for topbar HTML loaded
    GEvent.LD_SDBAR = "load_sidebar";       // Signal for sidebar needing loaded
    GEvent.LD_TPBAR = "load_topbar";        // Signal for topbar needing loaded

    GEvent.BLDG_PNL = "building_panel";     // Building Panel
    GEvent.INDX_PNL = "indexer_panel";      // Indexer Panel

    GEvent.GM_TPBAR = "game_top_bar";       // Game Top Bar

    GEvent.ST_CLICK = "set_click";          // Signal what should happen on a click event.

    GEvent.STAN_BLD = "standard_building";  // The standard type of building
    GEvent.LIBR_BLD = "library_building";   // The library type of building

    GEvent.STAN_IDX = "standard_indexer";   // The standard type of indexer
    GEvent.HOBB_IDX = "hobbyist_indexer";   // The hobbyist type of indexer

    GEvent.CNVS_CLK = "canvas_click";       // The canvas click event type
    GEvent.CNVS_DRG = "canvas_drag";        // The canvas drag event type

    GEvent.VTRY_PNL = "victory_panel";      // Victory Panel

    return GEvent;
});
