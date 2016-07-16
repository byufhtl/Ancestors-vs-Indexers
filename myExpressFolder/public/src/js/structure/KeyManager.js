/**
 * Created by calvin on 7/15/16.
 */

define(['structure/util/Sig'], function(Sig){

    function KeyManager(lieutenant) {
        this.lieutenant = lieutenant;
        this.keysEnabled = true;
    }

    KeyManager.prototype.handle = function(event){
        var self = this;
        switch(event.type) {
            case Sig.CMND_ACT:
                if(event.value == Sig.DISBL_UI){
                    self.disableKeys(true);
                }
                else if(event.value == Sig.ENABL_UI){
                    self.disableKeys(false);
                }
                break;
        }
    };

    KeyManager.prototype.disableKeys = function(status){
        this.keysEnabled = status;
    };

    KeyManager.prototype.init = function(){
        var self = this;
        $(document).keydown(function(e){
            if(e.which == 112 || e.which == 27){
                self.lieutenant.handle(new Sig(Sig.KY_PRS_P, Sig.KY_PRS_P, {keyPressEvent: e}));
            }
        });

    };

    return KeyManager;

});