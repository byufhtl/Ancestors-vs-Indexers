/**
 * Created by calvinm2 on 10/28/16.
 */
///<reference path="ImageManager.ts"/>
var ServerManager = (function () {
    function ServerManager(tenacity) {
        this.imageProxy = null;
        this.tenacity = tenacity;
        this.imageProxy = new ImageManager(this.tenacity);
    }
    ServerManager.prototype.login = function () {
    };
    ServerManager.prototype.register = function () {
    };
    ServerManager.prototype.loadStaticResourceBundle = function (bundleType) {
        switch (bundleType) {
            case RECBUNDLE.LOGIN_BNDL:
                this.imageProxy.prefetchBatch(BATCH.LOGIN_IMGS);
                break;
        }
    };
    ServerManager.prototype.getStatic = function (url, type, success, failure) {
        switch (type) {
            case RECTYPE.IMAGE:
                this.fetchImage(url, success, failure);
        }
    };
    ServerManager.prototype.fetchImage = function (url, success, failure) {
        this.imageProxy.fetchImage(url, success, failure);
    };
    return ServerManager;
}());
var RECTYPE;
(function (RECTYPE) {
    RECTYPE[RECTYPE["IMAGE"] = 0] = "IMAGE";
})(RECTYPE || (RECTYPE = {}));
var RECBUNDLE;
(function (RECBUNDLE) {
    RECBUNDLE[RECBUNDLE["LOGIN_BNDL"] = 0] = "LOGIN_BNDL";
})(RECBUNDLE || (RECBUNDLE = {}));
