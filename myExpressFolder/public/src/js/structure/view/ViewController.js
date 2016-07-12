/**
 * Created by calvin on 7/8/16.
 */

define(['structure/util/Sig','structure/view/HTMLManager'],function(Sig, HTMLManager){

    function ViewController(){
        this.lieutenant = {handle:function (event) {
            console.log("ViewController has signal that cannot be sent.");
        }};
        this.htmlManager = new HTMLManager();
    }

    ViewController.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case Sig.LD_INTFC:
                self.htmlManager.handle(event);
                break;
            case Sig.LD_TPBAR:
                self.htmlManager.handle(event);
                break;
            case Sig.LD_SDBAR:
                self.htmlManager.handle(event);
                break;
        }
    };


    return ViewController;
});