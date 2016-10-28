/**
 * Created by calvinm2 on 10/25/16.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="AbstractController.ts"/>
///<reference path="../util/Signal.ts"/>
var LoginController = (function (_super) {
    __extends(LoginController, _super);
    function LoginController(boss) {
        _super.call(this, "LoginController", boss);
    }
    LoginController.prototype.activate = function () {
        return true;
    };
    LoginController.prototype.handleClick = function (pt) {
        // Doesn't do much for now.
        return true;
    };
    LoginController.prototype.handleDrag = function (pt1, pt2) {
        // Dragging does nothing on this controller.
        return true;
    };
    LoginController.prototype.handleKey = function (event) {
        // No current usage
        return true;
    };
    LoginController.prototype.handle = function (signal) {
        // Nothing to do here for now.
    };
    return LoginController;
}(AbstractController));
//# sourceMappingURL=LoginController.js.map