/**
 * Created by calvinm2 on 10/26/16.
 */
///<reference path="FSManager.ts"/>
///<reference path="../controllers/IController.ts"/>
var Commander = (function () {
    function Commander() {
        this.fsManager = new FSManager();
    }
    Commander.get = function () {
        if (!Commander.comm) {
            Commander.comm = new Commander();
        }
        return Commander.comm;
    };
    // INSTANCE DEFINITIONS ==========================================================================================[]
    Commander.prototype.handle = function (signal) {
        switch (signal.type) {
            case Signal.FSREQUEST:
                this.fsManager.handle(signal);
                break;
        }
        console.log("Unrecognized command in the Commander", signal);
    };
    // SINGLETON PATTERN CONFIGURATION ===============================================================================[]
    Commander.comm = null;
    return Commander;
}());
