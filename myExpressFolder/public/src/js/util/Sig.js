/**
 * Created by calvin on 7/8/16.
 */

define([],function(){

    function Sig(type, value, data){
        this.type = type; // string
        this.value = value ; // string
        this.data = data ? data : null; // {}
    }

    // Signal static events (values made short for faster comparisons

    //      NAME                VALUE                   Description                                 TYPE

    // SYSTEM FAULTS ===============================================================================================[]>
    Sig.    SFAILURE =          "failure";              // System Failure                           *

    Sig.    CRT_FAIL =          "critical";             // Critical Failure
    Sig.    REC_FAIL =          "recover";              // Recoverable Failure


    // COMMANDEREVENTS =============================================================================================[]>
    Sig.    START_GM =          "startGame";            // Create the GameController and start game *

    // USER DATA ===================================================================================================[]>
    Sig.    UPD_USER =          "uptusr";               // Update User Information                  *

    Sig.    LVL_VCTR =          "lvvic";                // Level Victory
    Sig.    LVL_DEFT =          "lvdft";                // Level Defeat

    // CONTROLLEREVENTS ============================================================================================[]>
    Sig.    CMND_ACT =          "commact";              // Request action from commander            *

    Sig.    GET_LODR =          "gtldr";                // Get the loaderUtils object               *
    Sig.    SET_LODR =          "stldr";                // Set the loaderUtils object               *
    Sig.    HAS_LODR =          "hsldr";                // Has a loaderUtils object                 *
    Sig.    IMG_LODR =          "imldr";                // Image Loader
    Sig.    HTM_LODR =          "htldr";                // HTML Loader

    Sig.    START_MM =          "sttmm";                // Start the Main Menu
    Sig.    INIT_GAM =          "inigm";                // Initialize Game call
    Sig.    INIT_LVL =          "inilv";                // Initialize Levels Interface
    Sig.    INIT_UPG =          "iniug";                // Initialize Upgrades Interface
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

    // Render Commands ====================================================================================================[]>

    Sig.    UPD_RNDR =          "updrn";                // Update RENDERER
    Sig.    SET_BOARD =         "setBr";                // Set board in RENDERER
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
    Sig.    DROP_PNL =          "dropl";                // Drops Panel
    Sig.    BLNK_PNL =          "blkpl";                // Blank Panel
    Sig.    VTRY_PNL =          "vtrpl";                // Victory Panel
    Sig.    DEFT_PNL =          "dftpl";                // Defeat Panel
    Sig.    EM_SDBAR =          'empsb';                // Empty Side Bar

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
    Sig.    RSCH_IDX =          "rsidx";                // Researcher

    Sig.    STRY_DRP =          "stryd";                // StoryTeller

    // KEY SIGNALS =================================================================================================[]>
    Sig.    KEY_ACTN =          "kyact";                // Key Press                                *

    Sig.    KY_PRS_P =          "pkypr";                // 'p' Key (ASCII 112)

    Sig.    KY_PRS_U =          "pkyup";                // up key pressed
    Sig.    KY_PRS_D =          "pkydn";                // down key pressedd
    Sig.    KY_PRS_L =          "pkylf";                // left key pressedd
    Sig.    KY_PRS_R =          "pkyrt";                // right key pressed


    // MODAL DISPLAY ===============================================================================================[]>
    Sig.    LD_MODAL =          "ldmdl";                // Load Modal                               *
    Sig.    MODAL_LD =          "mdlld";                // Modal Loaded                             *

    Sig.    ANC_INFO =          "aninf";                // Ancestor Information

    // IMAGE RETRIEVAL =============================================================================================[]>
    Sig.    LD_IMGST =          "limgs";                // Load Image Set                           *
    Sig.    FTCH_IMG =          "ftimg";                // Fetch Image                              *

    Sig.    FLD_IMGS =          "field";                // Field Image Set
    Sig.    BKG_IMGS =          "bckgd";                // Background Image Set
    Sig.    REC_IMGS =          "rcrds";                // Records Image Set
    Sig.    IND_IMGS =          "indxr";                // Indexers Image Set
    Sig.    BLD_IMGS =          "bldgs";                // Building Image Set
    Sig.    ANC_IMGS =          "ancts";                // Ancestor Image Set
    Sig.    ALL_IMGS =          "allim";                // All Images

    // LEVEL MANIPULATION ===========================================================================================[]>
    Sig.    LVL_CMND =          "lvcmd";                // Level Command                            *

    Sig.    SET_LEVL =          "lvset";                // Set Level
    Sig.    STRT_LVL =          "stlvl";                // Start level currently selected

    return Sig;
});
