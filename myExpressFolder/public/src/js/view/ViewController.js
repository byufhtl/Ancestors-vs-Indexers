/**
 * Created by calvin on 7/8/16.
 */

define(['util/Sig','view/HTMLManager', 'view/ButtonManager', 'view/CanvasManager'],
    function(Sig, HTMLManager, ButtonManager, CanvasManager){

    function ViewController(){
        this.controller = ViewController.defaultLieutenant;

        var dummyHandler = {
            name: "Dummy ViewController",
            handle:function(event){ console.log("The ViewController was never initilalized.");  }
        };
        this.htmlManager = new HTMLManager(dummyHandler);
        this.buttonManager = new ButtonManager(dummyHandler);
        this.responsesEnabled = true;
    }

    ViewController.prototype.init = function(){
        this.htmlManager = new HTMLManager(this);
        this.buttonManager = new ButtonManager(this);
        this.canvasManager = new CanvasManager(this, null);
    };

    ViewController.defaultLieutenant = {handle:function (event) {
        console.log("ViewController has signal that cannot be sent.");
    }};

    ViewController.prototype.assign = function (lieutenant) {
        this.controller = (lieutenant) ? lieutenant : ViewController.defaultLieutenant;
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
            case Sig.INTFC_LD:  self.interfaceLoadedNextStep(event);                                    break;
            case Sig.TPBAR_LD:  ViewController.passSuccesses(event, self.buttonManager);                break;
            case Sig.SDBAR_LD:  ViewController.passSuccesses(event, self.buttonManager);                break;

            // MODAL MANAGEMENT
            case Sig.LD_MODAL:  self.htmlManager.handle(event);                                         break;
            case Sig.MODAL_LD:  self.buttonManager.handle(event);                                       break;

            // MANAGE UI
            case Sig.BTN_ACTN:  self.doIfEnabled(event, self.controller);                               break;
            case Sig.ST_CLICK:  self.doIfEnabled(event, self.controller);                               break;
            case Sig.CNVS_CLK:  self.doIfEnabled(event, self.controller);                               break;
            case Sig.CNVS_DRG:  self.doIfEnabled(event, self.controller);                               break;
            case Sig.KEY_ACTN:  self.doIfEnabled(event, self.controller);
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

    ViewController.prototype.interfaceLoadedNextStep = function(event){
        var self = this;
        if (event.value == Sig.GM_INTFC){
          //ViewController.passSuccesses(event, self.htmlManager);
          self.htmlManager.handle(new Sig(Sig.LD_TPBAR, Sig.GM_TPBAR, null));
          var data = {};
          data.canvas = self.canvasManager.init();
          self.controller.handle(new Sig(Sig.INTFC_LD, Sig.START_GM, data))
        }

        else {
          ViewController.passSuccesses(event, self.buttonManager);
        }
    };

    ViewController.passSuccesses = function(event, target){
        if(event.data && event.data.hasOwnProperty("success")){
            if(event.data.success == Sig.LD_SCESS){
                // console.log(event.type, event.value, "succeeded.");
                (target).handle(event);
                return;
            }
            if(event.data.success == Sig.LD_FAILD){
                console.log(event.type, event.value, "failed...", event.data);
                return;
            }
        }
        console.log("Could not check the success status on event", event);
    };


    ViewController.prototype.doIfEnabled = function(event, handler){
        if(this.responsesEnabled){
            (handler).handle(event);
            return;
        }
    };

    return ViewController;
});
