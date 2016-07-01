/**
 * Created by calvinmcm on 6/28/16.
 */

define(['Point'],function(Point){

    /**
     * The Transform and Manager for clicks on the canvas field.
     * @constructor
     */
    function ViewTransform(s_x, s_y, canvas){
        this.t_offset_X = s_x |0; // Init to 0 if param not passed in.
        this.t_offset_Y = s_y | 0;

        this.dragging = false;

        this.initialX = 0;
        this.initialY = 0;

        this.initialOffsetX = 0;
        this.initialOffsetY = 0;
    }

    ViewTransform.prototype.initializeMouseMovement = function()
    {
      var self = this;
        $('#canvas').mousemove(function( event ) {
            if (self.dragging)
            {
                self.t_offset_X = event.pageX - self.initialX + self.initialOffsetX;
                self.t_offset_Y = event.pageY - self.initialY + self.initialOffsetY;
            }
        });

        $('canvas').mousedown(function ( event ) {
            self.initialX = event.pageX;
            self.initialY = event.pageY;

            self.initialOffsetX = self.t_offset_X;
            self.initialOffsetY = self.t_offset_Y;
            self.dragging = true;
        });

        $('canvas').mouseup(function ( event) {
            self.dragging = false;
            console.log("totalx: " + self.t_offset_X);
            console.log("totaly:" + self.t_offset_Y);
        });
    };

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
        var newX = pt.X - this.t_offset_X - 200;
        var newY = pt.Y - this.t_offset_Y - 135;
        return new Point(newX, newY);
    };

    /**
     * Converts from game coordinates into browser-page-based coordinates.
     * @param pt
     * @returns {*}
     * @constructor
     */
    ViewTransform.prototype.VtoW = function(pt){
        var newX = pt.X + this.t_offset_X + 200;
        var newY = pt.Y + this.t_offset_Y + 135;
        return new Point(newX, newY);
    };

    return ViewTransform;
});
