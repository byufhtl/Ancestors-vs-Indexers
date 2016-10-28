/**
 * Created by calvinm2 on 10/28/16.
 */
///<reference path="IController.ts"/>
///<reference path="../commander/Commander.ts"/>
var AbstractController = (function () {
    function AbstractController(name, boss) {
        this.name = name;
        this.boss = boss;
    }
    AbstractController.prototype.getName = function () {
        return this.name;
    };
    return AbstractController;
}());
//# sourceMappingURL=AbstractController.js.map