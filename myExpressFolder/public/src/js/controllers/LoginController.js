/**
 * Created by calvinm2 on 10/25/16.
 */
///<reference path="IController.ts"/>
///<reference path="../util/Signal.ts"/>
var LoginController = (function () {
    function LoginController() {
    }
    LoginController.prototype.handle = function (signal) {
        var self = this;
        switch (signal.type) {
            case Signal.LOGIN_EV:
                self.handleLoginType(signal);
                break;
        }
    };
    LoginController.prototype.handleLoginType = function (signal) {
        var self = this;
        switch (signal.value) {
            case Signal.DO_LOGIN:
                break;
            case Signal.DO_REGST:
                break;
        }
    };
    return LoginController;
}());
