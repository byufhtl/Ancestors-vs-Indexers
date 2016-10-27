/**
 * Created by calvinm2 on 10/26/16.
 */

///<reference path="FSManager.ts"/>
///<reference path="../controllers/IController.ts"/>
class Commander implements IController{

    // SINGLETON PATTERN CONFIGURATION ===============================================================================[]

    private static comm: Commander = null;

    public static get() : Commander{
        if(!Commander.comm){
           Commander.comm = new Commander();
        }
        return Commander.comm;
    }

    // INSTANCE SETUP ================================================================================================[]

    private fsManager : FSManager;
    private imageManager : any;
    private audioManager : any;
    private serverManager : any;
    private gameModel : any;

    private constructor(){
        this.fsManager = new FSManager();
    }

    // INSTANCE DEFINITIONS ==========================================================================================[]
    public handle(signal: Signal){
        switch(signal.type){
            case Signal.FSREQUEST:
                this.fsManager.handle(signal);
                break;
        }
        console.log("Unrecognized command in the Commander", signal);
    }


}