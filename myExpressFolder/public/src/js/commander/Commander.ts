/**
 * Created by calvinm2 on 10/26/16.
 */

///<reference path="./FSManager.ts"/>
///<reference path="ICommander.ts"/>
///<reference path="../controllers/AbstractController.ts"/>
///<reference path="../controllers/LoginController.ts"/>

import FSManager = require("./FSManager");

class Commander implements ICommander{

    // PROJECT SETTINGS ==============================================================================================[]


    // INSTANCE SETUP ================================================================================================[]

    private fsManager : FSManager;
    private serverManager : any;
    private gameModel : any;

    private controllers: {};
    private activeController: AbstractController;

    public constructor(){
        this.fsManager = new FSManager();
    }

    public init(){
        this.controllers[CNTRLS.LOGIN] = new LoginController(this);
        this.switchControllerTo(CNTRLS.LOGIN);
    }

    // INSTANCE DEFINITIONS ==========================================================================================[]

    private switchControllerTo(controllerType :CNTRLS){
        this.activeController = this.controllers[controllerType];
        this.activeController.activate();
    }

    handleClick(pt: Point): boolean {
        return true;
    }
    handleDrag(pt1: Point, pt2: Point): boolean{
        return true;
    }
    handleKey(event: any): boolean {
        return true;
    }

    public handle(signal: Signal){
        switch(signal.type){
            case Signal.FSREQUEST:
                if(signal.value == Signal.DO_LOGIN){
                    this.fsManager.login();
                }
                break;
        }
        console.log("Unrecognized command in the Commander", signal);
    }

    // STATIC CONSTANTS ==============================================================================================[]

}

export = Commander;

enum CNTRLS{
    LOGIN
}

