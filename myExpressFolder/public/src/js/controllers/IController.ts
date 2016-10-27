/**
 * Created by calvinm2 on 10/25/16.
 */

///<reference path="../util/Point.ts"/>
interface IController{
    handleClick(pt: Point):boolean;
    handleKey(event:any):boolean;

}