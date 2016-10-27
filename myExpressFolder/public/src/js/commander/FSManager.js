/**
 * Created by calvinm2 on 10/26/16.
 */
///<reference path="../controllers/IController.ts"/>
var FSManager = (function () {
    function FSManager() {
        this.fs = FS;
    }
    FSManager.prototype.handle = function (signal) {
    };
    return FSManager;
}());
