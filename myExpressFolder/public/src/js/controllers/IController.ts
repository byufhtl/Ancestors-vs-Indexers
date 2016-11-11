/**
 * Created by calvinm2 on 10/25/16.
 */

///<reference path="../util/Point.ts"/>
///<reference path="../util/Signal.ts"/>
interface IController{
    handleClick(pt: Point):boolean;
    handleDrag(pt1: Point, pt2:Point):boolean;
    handleKey(event:any):boolean;
    handle(signal:Signal):any;
}