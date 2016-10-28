/**
 * Created by calvinm2 on 10/28/16.
 * This class is just a workaround for the serverManager to be able to retrieve static image content.
 */
var ImageManager = (function () {
    function ImageManager(tenacity) {
        if (tenacity === void 0) { tenacity = 10; }
        this.cache = {};
        this.attempts = tenacity;
    }
    /**
     * Used to prefetch and cache an image.
     * @param url the url to hit.
     */
    ImageManager.prototype.prefetchImage = function (url) {
        this.getImage(url, this.attempts);
    };
    /**
     * Used to fetch a given image. Prefers cached responses where possible.
     * @param url The url to fetch
     * @param success A callback for successful image load.
     * @param failure A callback for failure to load.
     */
    ImageManager.prototype.fetchImage = function (url, success, failure) {
        if (!this.cache.hasOwnProperty(url)) {
            this.getImage(url, this.attempts, success, failure);
        }
        success(this.cache[url]);
    };
    /**
     * Used to get a static image file from the server.
     * @param url the url to request
     * @param attempts the number of attempts to be made to get the resource before declaring failure
     * @param success A callback for successful load.
     * @param failure A callback for failure to load.
     */
    ImageManager.prototype.getImage = function (url, attempts, success, failure) {
        if (success === void 0) { success = null; }
        if (failure === void 0) { failure = null; }
        var image = new Image();
        image.onload = function () {
            this.cache[url] = image;
            if (success) {
                success(image);
            }
        };
        image.onerror = function () {
            if (attempts > 1) {
                this.getImage(url, success, failure, attempts - 1);
            }
            else if (failure) {
                this.cache[url] = null;
                failure();
            }
        };
        image.src = url;
    };
    ImageManager.prototype.prefetchBatch = function (batch) {
        switch (batch) {
            case BATCH.LOGIN_IMGS:
                this.prefetchImage(ImageManager.LOGINSCN);
                break;
        }
    };
    // Const name                   URL                                         Description
    //==================================================================================================================
    ImageManager.LOGINSCN = "src/img/victory.png"; // VICTORY SCREEN
    return ImageManager;
}());
var BATCH;
(function (BATCH) {
    BATCH[BATCH["LOGIN_IMGS"] = 0] = "LOGIN_IMGS";
})(BATCH || (BATCH = {}));
