/**
 * Created by calvinm2 on 10/26/16.
 */
"use strict";
///<reference path="FSManager.ts"/>
///<reference path="ICommander.ts"/>
///<reference path="../controllers/AbstractController.ts"/>
///<reference path="../controllers/LoginController.ts"/>
var FSManager = require("./FSManager");
var Commander = (function () {
    function Commander() {
        this.fsManager = new FSManager.FSManager();
    }
    Commander.prototype.init = function () {
        this.controllers[CNTRLS.LOGIN] = new LoginController(this);
        this.switchControllerTo(CNTRLS.LOGIN);
    };
    // INSTANCE DEFINITIONS ==========================================================================================[]
    Commander.prototype.switchControllerTo = function (controllerType) {
        this.activeController = this.controllers[controllerType];
        this.activeController.activate();
    };
    Commander.prototype.handleClick = function (pt) {
        return true;
    };
    Commander.prototype.handleDrag = function (pt1, pt2) {
        return true;
    };
    Commander.prototype.handleKey = function (event) {
        return true;
    };
    Commander.prototype.handle = function (signal) {
        switch (signal.type) {
            case Signal.FSREQUEST:
                if (signal.value == Signal.DO_LOGIN) {
                    this.fsManager.login();
                }
                break;
        }
        console.log("Unrecognized command in the Commander", signal);
    };
    return Commander;
}());
var CNTRLS;
(function (CNTRLS) {
    CNTRLS[CNTRLS["LOGIN"] = 0] = "LOGIN";
})(CNTRLS || (CNTRLS = {}));
module.exports = Commander;
//# sourceMappingURL=Commander.js.map