/**
 * Created by calvinm2 on 10/28/16.
 */

///<reference path="ImageManager.ts"/>
class ServerManager{

    private tenacity: number;
    private imageProxy: ImageManager = null;

    constructor(tenacity:number){
        this.tenacity = tenacity;
        this.imageProxy = new ImageManager(this.tenacity);
    }

    public login(){

    }

    public register(){

    }

    public loadStaticResourceBundle(bundleType: RECBUNDLE){
        switch(bundleType){
            case RECBUNDLE.LOGIN_BNDL:
                this.imageProxy.prefetchBatch(BATCH.LOGIN_IMGS);
                break;
        }
    }

    public getStatic(url:string , type: RECTYPE, success, failure){
        switch(type){
            case RECTYPE.IMAGE:
                this.fetchImage(url, success, failure);
        }
    }

    private fetchImage(url, success, failure){
        this.imageProxy.fetchImage(url, success, failure);
    }


}

enum RECTYPE{
    IMAGE
}

enum RECBUNDLE{
    LOGIN_BNDL
}