/**
 * Created by calvinm2 on 10/26/16.
 */

class Point{

    public x : number;
    public y : number;

    constructor(x:number, y: number){
        this.x = x;
        this.y = y;
    }

    constructor(pt:Point){
        this.x = pt.x;
        this.y = pt.y;
    }
}