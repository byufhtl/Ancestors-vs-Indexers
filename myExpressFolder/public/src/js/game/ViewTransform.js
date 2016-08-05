/**
 * Created by calvinmcm on 6/28/16.
 */

define(['util/Point'],function(Point){

    /**
     * The Transform and Manager for clicks on the canvas field.
     * @constructor
     */
    function ViewTransform(s_x, s_y, canvas){
        this.t_offset_X = s_x |0; // Init to 0 if param not passed in.
        this.t_offset_Y = s_y | 0;
    }

    ViewTransform.prototype.getX = function(){
        return this.t_offset_X;
    };

    ViewTransform.prototype.getY = function(){
        return this.t_offset_Y;
    };

    ViewTransform.prototype.setX = function(x){
        this.t_offset_X = x;
    };

    ViewTransform.prototype.setY = function(y){
        this.t_offset_Y = y;
    };

    ViewTransform.prototype.addX = function(x){
        this.t_offset_X += x;
    };

    ViewTransform.prototype.addY = function(y){
        this.t_offset_Y += y;
    };



    /**
     * Converts from browser-page-based coordinates into game coordinates on the canvas.
     * @param pt
     * @returns {*}
     * @constructor
     */
    ViewTransform.prototype.WtoV = function(pt){
        var newX = pt.X - this.t_offset_X - 0;
        var newY = pt.Y - this.t_offset_Y - 60;
        return new Point(newX, newY);
    };

    /**
     * Converts from game coordinates into browser-page-based coordinates.
     * @param pt
     * @returns {*}
     * @constructor
     */
    ViewTransform.prototype.VtoW = function(pt){
        var newX = pt.X + this.t_offset_X + 0;
        var newY = pt.Y + this.t_offset_Y + 60;
        return new Point(newX, newY);
    };

    return ViewTransform;
});
