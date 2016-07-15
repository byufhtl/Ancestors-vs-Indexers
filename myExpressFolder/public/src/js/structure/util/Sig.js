/**
 * Created by calvin on 7/8/16.
 */

define([],function(){

    function Sig(type, value, data){
        this.type = type; // string
        this.value = value; // string
        this.data = data; // {}
    }

    // Signal static events (values made short for faster comparisons

    //      NAME                VALUE                   Description                                 TYPE

    // CONTROLLEREVENTS ============================================================================================[]>
    Sig.    CMND_ACT =          "commact";              // Request action from commander            *

    Sig.    STRT_LVL =          "stlvl";                // Start level currently selected
    Sig.    GET_LODR =          "gtldr";                // Get the loaderUtils object               *
    Sig.    SET_LODR =          "stldr";                // Set the loaderUtils object               *
    Sig.    HAS_LODR =          "hsldr";                // Has a loaderUtils object                 *
    Sig.    IMG_LODR =          "imldr";                // Image Loader
    Sig.    HTM_LODR =          "htldr";                // HTML Loader

    Sig.    START_MM =          "sttmm";                // Start the Main Menu
    Sig.    DISBL_UI =          "disui";                // Disable UI components
    Sig.    ENABL_UI =          "enbui";                // Enable UI components

    // INTERFACES ==================================================================================================[]>
    Sig.    LD_INTFC =          "Ldint";                // Load Interface                           *
    Sig.    INTFC_LD =          "Intld";                // Interface Loaded                         *

    Sig.    SP_INTFC =          "spint";                // Splash Interface
    Sig.    MM_INTFC =          "mmint";                // Main Menu Interface
    Sig.    GM_INTFC =          "gmint";                // Game Interface
    Sig.    LV_INTFC =          "lvint";                // Level Interface
    Sig.    UG_INTFC =          "ugint";                // Upgrade Interface

    Sig.    LD_SCESS =          "scess";                // Load was successful.                     d
    Sig.    LD_FAILD =          "faild";                // Load failed.                             d

    // TOP BARS ====================================================================================================[]>
    Sig.    LD_TPBAR =          "Ldtpbr";               // Load Top Bar                             *
    Sig.    TPBAR_LD =          "Tpbrld";               // Top Bar Loaded                           *

    Sig.    GM_TPBAR =          "gmtpbr";               // Game Top Bar
    Sig.    EM_TPBAR =          "emtpbr";               // Empty Top Bar

    // SIDE BARS ===================================================================================================[]>
    Sig.    LD_SDBAR =          "ldsdbr";               // Load Sidebar                             *
    Sig.    SDBAR_LD =          "sdbrld";               // Sidebar Loaded                           *

    Sig.    BLDG_PNL =          "bldpl";                // Building Panel
    Sig.    INDX_PNL =          "indpl";                // Indexer Panel
    Sig.    BLNK_PNL =          "blkpl";                // Blank Panel
    Sig.    VTRY_PNL =          "vtrpl";                // Victory Panel
    Sig.    DEFT_PNL =          "dftpl";                // Defeat Panel

    // CLICKING ====================================================================================================[]>
    Sig.    CNVS_CLK =          "cvclk";                // Canvas Click                             *
    Sig.    CNVS_DRG =          "cvdrg";                // Canvas Drag                              *

    // BUTTON SIGNALS ==============================================================================================[]>
    Sig.    BTN_ACTN =          "bnact";                // Button Action                            *

    Sig.    NEXT_BTN =          "nlbtn";                // Next Level Button
    Sig.    AGAN_BTN =          "pabtn";                // Play Level Again Button
    Sig.    MENU_BTN =          "mebtn";                // Menu Button
    Sig.    LOGN_BTN =          "lgbtn";                // Login Button
    Sig.    STRT_BTN =          "stbtn";                // Start Button

    Sig.    ST_CLICK =          "stclk";                // SetClick                                 *

    Sig.    STAN_BLD =          "sdbld";                // Standard Building
    Sig.    LIBR_BLD =          "lbbld";                // Library

    Sig.    STAN_IDX =          "sdidx";                // Standard Indexer
    Sig.    HOBB_IDX =          "hbidx";                // Hobbyist
    Sig.    UBER_IDX =          "ubidx";                // Unbeatable

    // KEY SIGNALS =================================================================================================[]>
    Sig.    KEY_ACTN =          "kyact";                // Key Press                                *

    Sig.    KY_PRS_P =          "pkypr";                // 'p' Key (ASCII 112)


    // MODAL DISPLAY ==============================================================================================[]>
    Sig.    LD_MODAL =          "ldmdl";                // Load Modal                               *

    Sig.    ANC_INFO =          "aninf";                // Ancestor Information

    return Sig;
});