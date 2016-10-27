/**
 * Created by calvinm2 on 10/25/16.
 */
/**
 * Created by calvin on 7/8/16.
 */
var Signal = (function () {
    function Signal(type, value, data) {
        this.type = type; // string
        this.value = value; // string
        this.data = data ? data : null; // {}
    }
    Signal.prototype.matches = function (type) {
        return (this.type === type);
    };
    // Signal static events (values made short for faster comparisons
    //      NAME                VALUE               Description                                     CASTE
    // SYSTEM FAULTS ===============================================================================================[]>
    Signal.SFAILURE = "failure"; // System Failure                               TYPE
    Signal.CRT_FAIL = "critical"; // Critical Failure                             VALUE
    Signal.REC_FAIL = "recover"; // Recoverable Failure                          VALUE
    // LOGIN EVENTS ================================================================================================[]>
    Signal.LOGIN_EV = "loginEvent"; // Login Event                                  TYPE
    Signal.DO_LOGIN = "doLogin"; // Login Event                                  VALUE
    Signal.DO_REGST = "doRegister"; // Resitration Event                            VALUE
    // MANAGERS ====================================================================================================[]>
    Signal.GET = "get"; // Gets an item from a manager                  TYPE
    Signal.POST = "post"; // Posts an item to a manager                   TYPE
    Signal.PUT = "put"; // Puts something into a manager                TYPE
    Signal.AUDIO = "audio"; // Audio value                                  VALUE
    Signal.IMAGE = "image"; // Image value                                  VALUE
    Signal.SREQUEST = "srequest"; // Server request                               VALUE
    Signal.FSREQUEST = "fsrequest"; // FamilySearch request                         VALUE
    // COMMANDEREVENTS =============================================================================================[]>
    Signal.START_GM = "startGame"; // Create the GameController and start game *
    // USER DATA ===================================================================================================[]>
    Signal.UPD_USER = "uptusr"; // Update User Information                  *
    Signal.LVL_VCTR = "lvvic"; // Level Victory
    Signal.LVL_DEFT = "lvdft"; // Level Defeat
    // CONTROLLEREVENTS ============================================================================================[]>
    Signal.CMND_ACT = "commact"; // Request action from commander            *
    Signal.GET_LODR = "gtldr"; // Get the loaderUtils object               *
    Signal.SET_LODR = "stldr"; // Set the loaderUtils object               *
    Signal.HAS_LODR = "hsldr"; // Has a loaderUtils object                 *
    Signal.IMG_LODR = "imldr"; // Image Loader
    Signal.HTM_LODR = "htldr"; // HTML Loader
    Signal.START_MM = "sttmm"; // Start the Main Menu
    Signal.INIT_GAM = "inigm"; // Initialize Game call
    Signal.INIT_LVL = "inilv"; // Initialize Levels Interface
    Signal.INIT_UPG = "iniug"; // Initialize Upgrades Interface
    Signal.DISBL_UI = "disui"; // Disable UI components
    Signal.ENABL_UI = "enbui"; // Enable UI components
    // INTERFACES ==================================================================================================[]>
    Signal.LD_INTFC = "Ldint"; // Load Interface                           *
    Signal.INTFC_LD = "Intld"; // Interface Loaded                         *
    Signal.SP_INTFC = "spint"; // Splash Interface
    Signal.MM_INTFC = "mmint"; // Main Menu Interface
    Signal.GM_INTFC = "gmint"; // Game Interface
    Signal.LV_INTFC = "lvint"; // Level Interface
    Signal.UG_INTFC = "ugint"; // Upgrade Interface
    Signal.LD_SCESS = "scess"; // Load was successful.                     d
    Signal.LD_FAILD = "faild"; // Load failed.                             d
    // Render Commands ====================================================================================================[]>
    Signal.UPD_RNDR = "updrn"; // Update RENDERER
    Signal.SET_BOARD = "setBr"; // Set board in RENDERER
    // TOP BARS ====================================================================================================[]>
    Signal.LD_TPBAR = "Ldtpbr"; // Load Top Bar                             *
    Signal.TPBAR_LD = "Tpbrld"; // Top Bar Loaded                           *
    Signal.GM_TPBAR = "gmtpbr"; // Game Top Bar
    Signal.EM_TPBAR = "emtpbr"; // Empty Top Bar
    // SIDE BARS ===================================================================================================[]>
    Signal.LD_SDBAR = "ldsdbr"; // Load Sidebar                             *
    Signal.SDBAR_LD = "sdbrld"; // Sidebar Loaded                           *
    Signal.BLDG_PNL = "bldpl"; // Building Panel
    Signal.INDX_PNL = "indpl"; // Indexer Panel
    Signal.DROP_PNL = "dropl"; // Drops Panel
    Signal.BLNK_PNL = "blkpl"; // Blank Panel
    Signal.VTRY_PNL = "vtrpl"; // Victory Panel
    Signal.DEFT_PNL = "dftpl"; // Defeat Panel
    Signal.EM_SDBAR = 'empsb'; // Empty Side Bar
    // CLICKING ====================================================================================================[]>
    Signal.CNVS_CLK = "cvclk"; // Canvas Click                             *
    Signal.CNVS_DRG = "cvdrg"; // Canvas Drag                              *
    // BUTTON SIGNALS ==============================================================================================[]>
    Signal.BTN_ACTN = "bnact"; // Button Action                            *
    Signal.NEXT_BTN = "nlbtn"; // Next Level Button
    Signal.AGAN_BTN = "pabtn"; // Play Level Again Button
    Signal.MENU_BTN = "mebtn"; // Menu Button
    Signal.LOGN_BTN = "lgbtn"; // Login Button
    Signal.STRT_BTN = "stbtn"; // Start Button
    Signal.ST_CLICK = "stclk"; // SetClick                                 *
    Signal.STAN_BLD = "sdbld"; // Standard Building
    Signal.LIBR_BLD = "lbbld"; // Library
    Signal.STAN_IDX = "sdidx"; // Standard Indexer
    Signal.HOBB_IDX = "hbidx"; // Hobbyist
    Signal.UBER_IDX = "ubidx"; // Unbeatable
    Signal.RSCH_IDX = "rsidx"; // Researcher
    Signal.STRY_DRP = "stryd"; // StoryTeller
    // KEY SIGNALS =================================================================================================[]>
    Signal.KEY_ACTN = "kyact"; // Key Press                                *
    Signal.KY_PRS_P = "pkypr"; // 'p' Key (ASCII 112)
    Signal.KY_PRS_U = "pkyup"; // up key pressed
    Signal.KY_PRS_D = "pkydn"; // down key pressedd
    Signal.KY_PRS_L = "pkylf"; // left key pressedd
    Signal.KY_PRS_R = "pkyrt"; // right key pressed
    // MODAL DISPLAY ===============================================================================================[]>
    Signal.LD_MODAL = "ldmdl"; // Load Modal                               *
    Signal.MODAL_LD = "mdlld"; // Modal Loaded                             *
    Signal.ANC_INFO = "aninf"; // Ancestor Information
    // IMAGE RETRIEVAL =============================================================================================[]>
    Signal.LD_IMGST = "limgs"; // Load Image Set                           *
    Signal.FTCH_IMG = "ftimg"; // Fetch Image                              *
    Signal.FLD_IMGS = "field"; // Field Image Set
    Signal.BKG_IMGS = "bckgd"; // Background Image Set
    Signal.REC_IMGS = "rcrds"; // Records Image Set
    Signal.IND_IMGS = "indxr"; // Indexers Image Set
    Signal.BLD_IMGS = "bldgs"; // Building Image Set
    Signal.ANC_IMGS = "ancts"; // Ancestor Image Set
    Signal.ALL_IMGS = "allim"; // All Images
    // LEVEL MANIPULATION ===========================================================================================[]>
    Signal.LVL_CMND = "lvcmd"; // Level Command                            *
    Signal.SET_LEVL = "lvset"; // Set Level
    Signal.STRT_LVL = "stlvl"; // Start level currently selected
    return Signal;
}());
