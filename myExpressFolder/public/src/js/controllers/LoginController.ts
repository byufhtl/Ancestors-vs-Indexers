/**
 * Created by calvinm2 on 10/25/16.
 */

///<reference path="AbstractController.ts"/>
///<reference path="../util/Signal.ts"/>
class LoginController extends AbstractController{

    constructor(boss: ICommander){
        super("LoginController",boss);
    }

    activate(): boolean{
        return true;
    }

    handleClick(pt: Point): boolean {
        // Doesn't do much for now.
        return true;
    }
    handleDrag(pt1: Point, pt2: Point): boolean{
        // Dragging does nothing on this controller.
        return true;
    }
    handleKey(event: any): boolean {
        // No current usage
        return true;
    }

    public handle(signal:Signal) :void {
        // Nothing to do here for now.
    }

}