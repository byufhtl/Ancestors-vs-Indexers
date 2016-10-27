/**
 * Created by calvinm2 on 10/25/16.
 */
/**
 * Created by calvin on 7/8/16.
 */

class Signal {

    public type: string;
    public value: string;
    public data: any;

    constructor(type, value, data) {
        this.type = type; // string
        this.value = value; // string
        this.data = data ? data : null; // {}
    }

    public matches(type: string){
        return(this.type === type);
    }

    // Signal static events (values made short for faster comparisons

    //      NAME                VALUE               Description                                     CASTE

    // SYSTEM FAULTS ===============================================================================================[]>
    public static SFAILURE  = "failure";            // System Failure                               TYPE

    public static CRT_FAIL  = "critical";           // Critical Failure                             VALUE
    public static REC_FAIL  = "recover";            // Recoverable Failure                          VALUE

    // LOGIN EVENTS ================================================================================================[]>
    public static LOGIN_EV  = "loginEvent";         // Login Event                                  TYPE
    public static DO_LOGIN  = "doLogin";            // Login Event                                  VALUE
    public static DO_REGST  = "doRegister";         // Resitration Event                            VALUE

    // MANAGERS ====================================================================================================[]>
    public static GET       = "get";                // Gets an item from a manager                  TYPE
    public static POST      = "post";               // Posts an item to a manager                   TYPE
    public static PUT       = "put";                // Puts something into a manager                TYPE

    public static AUDIO     = "audio";              // Audio value                                  VALUE
    public static IMAGE     = "image";              // Image value                                  VALUE
    public static SREQUEST  = "srequest";           // Server request                               VALUE
    public static FSREQUEST = "fsrequest";          // FamilySearch request                         VALUE

    // COMMANDEREVENTS =============================================================================================[]>
    public static START_GM = "startGame";            // Create the GameController and start game *

    // USER DATA ===================================================================================================[]>
    public static UPD_USER = "uptusr";               // Update User Information                  *

    public static LVL_VCTR = "lvvic";                // Level Victory
    public static LVL_DEFT = "lvdft";                // Level Defeat

    // CONTROLLEREVENTS ============================================================================================[]>
    public static CMND_ACT = "commact";              // Request action from commander            *

    public static GET_LODR = "gtldr";                // Get the loaderUtils object               *
    public static SET_LODR = "stldr";                // Set the loaderUtils object               *
    public static HAS_LODR = "hsldr";                // Has a loaderUtils object                 *
    public static IMG_LODR = "imldr";                // Image Loader
    public static HTM_LODR = "htldr";                // HTML Loader

    public static START_MM = "sttmm";                // Start the Main Menu
    public static INIT_GAM = "inigm";                // Initialize Game call
    public static INIT_LVL = "inilv";                // Initialize Levels Interface
    public static INIT_UPG = "iniug";                // Initialize Upgrades Interface
    public static DISBL_UI = "disui";                // Disable UI components
    public static ENABL_UI = "enbui";                // Enable UI components

    // INTERFACES ==================================================================================================[]>
    public static LD_INTFC = "Ldint";                // Load Interface                           *
    public static INTFC_LD = "Intld";                // Interface Loaded                         *

    public static SP_INTFC = "spint";                // Splash Interface
    public static MM_INTFC = "mmint";                // Main Menu Interface
    public static GM_INTFC = "gmint";                // Game Interface
    public static LV_INTFC = "lvint";                // Level Interface
    public static UG_INTFC = "ugint";                // Upgrade Interface

    public static LD_SCESS = "scess";                // Load was successful.                     d
    public static LD_FAILD = "faild";                // Load failed.                             d

    // Render Commands ====================================================================================================[]>

    public static UPD_RNDR = "updrn";                // Update RENDERER
    public static SET_BOARD = "setBr";                // Set board in RENDERER
    // TOP BARS ====================================================================================================[]>
    public static LD_TPBAR = "Ldtpbr";               // Load Top Bar                             *
    public static TPBAR_LD = "Tpbrld";               // Top Bar Loaded                           *

    public static GM_TPBAR = "gmtpbr";               // Game Top Bar
    public static EM_TPBAR = "emtpbr";               // Empty Top Bar

    // SIDE BARS ===================================================================================================[]>
    public static LD_SDBAR = "ldsdbr";               // Load Sidebar                             *
    public static SDBAR_LD = "sdbrld";               // Sidebar Loaded                           *

    public static BLDG_PNL = "bldpl";                // Building Panel
    public static INDX_PNL = "indpl";                // Indexer Panel
    public static DROP_PNL = "dropl";                // Drops Panel
    public static BLNK_PNL = "blkpl";                // Blank Panel
    public static VTRY_PNL = "vtrpl";                // Victory Panel
    public static DEFT_PNL = "dftpl";                // Defeat Panel
    public static EM_SDBAR = 'empsb';                // Empty Side Bar

    // CLICKING ====================================================================================================[]>
    public static CNVS_CLK = "cvclk";                // Canvas Click                             *
    public static CNVS_DRG = "cvdrg";                // Canvas Drag                              *

    // BUTTON SIGNALS ==============================================================================================[]>
    public static BTN_ACTN = "bnact";                // Button Action                            *

    public static NEXT_BTN = "nlbtn";                // Next Level Button
    public static AGAN_BTN = "pabtn";                // Play Level Again Button
    public static MENU_BTN = "mebtn";                // Menu Button
    public static LOGN_BTN = "lgbtn";                // Login Button
    public static STRT_BTN = "stbtn";                // Start Button

    public static ST_CLICK = "stclk";                // SetClick                                 *

    public static STAN_BLD = "sdbld";                // Standard Building
    public static LIBR_BLD = "lbbld";                // Library

    public static STAN_IDX = "sdidx";                // Standard Indexer
    public static HOBB_IDX = "hbidx";                // Hobbyist
    public static UBER_IDX = "ubidx";                // Unbeatable
    public static RSCH_IDX = "rsidx";                // Researcher

    public static STRY_DRP = "stryd";                // StoryTeller

    // KEY SIGNALS =================================================================================================[]>
    public static KEY_ACTN = "kyact";                // Key Press                                *

    public static KY_PRS_P = "pkypr";                // 'p' Key (ASCII 112)

    public static KY_PRS_U = "pkyup";                // up key pressed
    public static KY_PRS_D = "pkydn";                // down key pressedd
    public static KY_PRS_L = "pkylf";                // left key pressedd
    public static KY_PRS_R = "pkyrt";                // right key pressed


    // MODAL DISPLAY ===============================================================================================[]>
    public static LD_MODAL = "ldmdl";                // Load Modal                               *
    public static MODAL_LD = "mdlld";                // Modal Loaded                             *

    public static ANC_INFO = "aninf";                // Ancestor Information

    // IMAGE RETRIEVAL =============================================================================================[]>
    public static LD_IMGST = "limgs";                // Load Image Set                           *
    public static FTCH_IMG = "ftimg";                // Fetch Image                              *

    public static FLD_IMGS = "field";                // Field Image Set
    public static BKG_IMGS = "bckgd";                // Background Image Set
    public static REC_IMGS = "rcrds";                // Records Image Set
    public static IND_IMGS = "indxr";                // Indexers Image Set
    public static BLD_IMGS = "bldgs";                // Building Image Set
    public static ANC_IMGS = "ancts";                // Ancestor Image Set
    public static ALL_IMGS = "allim";                // All Images

    // LEVEL MANIPULATION ===========================================================================================[]>
    public static LVL_CMND = "lvcmd";                // Level Command                            *

    public static SET_LEVL = "lvset";                // Set Level
    public static STRT_LVL = "stlvl";                // Start level currently selected
}
