/**
 * Created by calvinm2 on 10/28/16.
 */


///<reference path="IController.ts"/>
///<reference path="../commander/Commander.ts"/>
abstract class AbstractController implements IController{

    protected name: string;
    protected boss: ICommander;
    constructor(name : string, boss: ICommander){
        this.name = name;
        this.boss = boss;
    }

    public getName(): string{
        return this.name;
    }

    abstract activate():boolean;

    abstract handleClick(pt: Point):boolean;
    abstract handleDrag(pt1: Point, pt2:Point):boolean;
    abstract handleKey(event:any):boolean;
    abstract handle(signal:Signal):any;
}