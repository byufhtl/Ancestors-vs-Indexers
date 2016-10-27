/**
 * Created by calvinm2 on 10/26/16.
 */

///<reference path="../controllers/IController.ts"/>
class FSManager implements IController{

    private fs :any;

    constructor(){
        this.fs = FS;
    }

}