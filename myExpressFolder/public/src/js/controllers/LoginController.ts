/**
 * Created by calvinm2 on 10/25/16.
 */

///<reference path="IController.ts"/>
///<reference path="../util/Signal.ts"/>
class LoginController implements IController{
    constructor(){

    }

    public handle(signal:Signal) :void {
        const self = this;
        switch(signal.type){
            case Signal.LOGIN_EV:
                self.handleLoginType(signal);
                break;
        }
    }

    private handleLoginType(signal: Signal) :void{
        const self = this;
        switch(signal.value){
            case Signal.DO_LOGIN:
                break;
            case Signal.DO_REGST:
                break;
        }
    }
}