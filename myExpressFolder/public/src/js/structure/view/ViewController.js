/**
 * Created by calvin on 7/8/16.
 */

define(['structure/util/Sig','structure/view/HTMLManager', 'structure/view/ButtonManager'], function(Sig, HTMLManager, ButtonManager){

    function ViewController(){
        this.lieutenant = {handle:function (event) {
            console.log("ViewController has signal that cannot be sent.");
        }};
        this.htmlManager = new HTMLManager();
        this.buttonManager = new ButtonManager();
        this.buttonManager.init();
        this.responsesEnabled = true;
    }
    
    ViewController.prototype.assign = function (lieutenant) {
        this.lieutenant = lieutenant;
    };

    ViewController.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case Sig.CMND_ACT:  self.obey(event);                                                       break;

            // LOAD COMPONENT
            case Sig.LD_INTFC:  self.htmlManager.handle(event);                                         break;
            case Sig.LD_TPBAR:  self.htmlManager.handle(event);                                         break;
            case Sig.LD_SDBAR:  self.htmlManager.handle(event);                                         break;

            // COMPONENT LOADED
            case Sig.INTFC_LD:  ViewController.passSuccesses(event, self.buttonManager.handle);         break;
            case Sig.TPBAR_LD:  ViewController.passSuccesses(event, self.buttonManager.handle);         break;
            case Sig.SDBAR_LD:  ViewController.passSuccesses(event, self.buttonManager.handle);         break;

            // MANAGE UI
            case Sig.BTN_ACTN:  self.doIfEnabled(event, self.lieutenant.handle);                        break;
            case Sig.ST_CLICK:  self.doIfEnabled(event, self.lieutenant.handle);                        break;
            case Sig.CNVS_CLK:  self.doIfEnabled(event, self.lieutenant.handle);                        break;
            case Sig.CNVS_DRG:  self.doIfEnabled(event, self.lieutenant.handle);                        break;

            // OTHER
            case Sig.GET_LODR:
                if(event.value == Sig.HTM_LODR){
                    return self.htmlManager.extractLoader();
                }
                break;
            default:
                console.log("ViewController couldn't match event to handler:", event)
        }
    };

    /**
     * Commander Action handler. These commands should be treated as imperative.
     * @param event
     */
    ViewController.prototype.obey = function(event){
        switch(event.value){
            case Sig.DISBL_UI:
                this.responsesEnabled = false;
                break;
            case Sig.ENABL_UI:
                this.responsesEnabled = true;
                break;
        }
    };

    /**
     * Passes events tagged as successful (Sig.LD_SCESS) to the provided function as the function's only parameter.
     * @param event
     * @param target
     */
    ViewController.passSuccesses = function(event, target){
        if(event.data && event.hasOwnProperty("success")){
            if(event["success"] == Sig.LD_SCESS){
                // console.log(event.type, event.value, "succeeded.");
                (target)(event);
            }
            if(event["failure"] == Sig.LD_SCESS){
                console.log(event.type, event.value, "failed...");
            }
        }
        console.log("Could not check the success status on event", event);
    };
        

    ViewController.prototype.doIfEnabled = function(event, handler){
        if(this.responsesEnabled){
            (handler)(event);
        }
    };

    return ViewController;
});