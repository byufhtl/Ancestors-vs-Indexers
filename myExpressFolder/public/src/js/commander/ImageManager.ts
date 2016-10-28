/**
 * Created by calvinm2 on 10/28/16.
 * This class is just a workaround for the serverManager to be able to retrieve static image content.
 */

class ImageManager{

    private cache: {};
    private attempts:number;

    constructor(tenacity:number = 10){
        this.cache = {};
        this.attempts = tenacity;
    }

    /**
     * Used to prefetch and cache an image.
     * @param url the url to hit.
     */
    public prefetchImage(url:string): void{
        this.getImage(url, this.attempts);
    }

    /**
     * Used to fetch a given image. Prefers cached responses where possible.
     * @param url The url to fetch
     * @param success A callback for successful image load.
     * @param failure A callback for failure to load.
     */
    public fetchImage(url: string, success, failure):void{
        if(!this.cache.hasOwnProperty(url)){
            this.getImage(url, this.attempts, success, failure);
        }
        success(this.cache[url]);
    }

    /**
     * Used to get a static image file from the server.
     * @param url the url to request
     * @param attempts the number of attempts to be made to get the resource before declaring failure
     * @param success A callback for successful load.
     * @param failure A callback for failure to load.
     */
    private getImage(url: string, attempts, success = null, failure = null): void{
        var image = new Image();
        image.onload = function() {
            this.cache[url] = image;
            if(success) {
                success(image);
            }
        };
        image.onerror = function() {
            if(attempts > 1){
                this.getImage(url, success, failure, attempts - 1);
            }
            else if(failure) {
                this.cache[url] = null;
                failure();
            }
        };
        image.src = url;
    }

    public prefetchBatch(batch:BATCH){
        switch(batch){
            case BATCH.LOGIN_IMGS:
                this.prefetchImage(ImageManager.LOGINSCN);
                break;
        }
    }

    // Const name                   URL                                         Description
    //==================================================================================================================
    public static LOGINSCN =        "src/img/victory.png";                      // VICTORY SCREEN
}

enum BATCH{
    LOGIN_IMGS
}