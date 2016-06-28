/**
 * Created by calvinmcm on 6/28/16.
 */

define(['jquery'],function($){

    /**
     * The Transform and Manager for clicks on the canvas field.
     * @constructor
     */
    function ViewTransform(s_x, s_y){
        this.t_offset_X = s_x | 0; // Init to 0 if param not passed in.
        this.t_offset_Y = s_y | 0;
    }

    function Point(x,y){
        this.X = x;
        this.Y = y;
    }

    ViewTransform.prototype.initClicking = function(){
        var self = this;
        var canvas = $('#canvas');

        var draggable = false;
        var dragged = false;

        var start;

        canvas.mousedown(function(event){
            draggable = true;

            start = new Point(event.pageX, event.pageY);
        });

        canvas.mousemove(function(event){
           if(draggable){
               dragged = true;
               var diff = new Point(event.pageX - start.X, event.pageY - start.Y);
               start = new Point(event.pageX, event.pageY);

               self.t_offset_X += diff.X;
               self.t_offset_Y += diff.Y;

           }
        });

        canvas.mouseup(function(event){
            draggable = false;
            if(dragged){

            }
            else{

            }
            dragged = false;
        });

    };


    return ViewTransform;

});