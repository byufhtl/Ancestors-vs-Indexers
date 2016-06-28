/**
 * Created by calvinmcm on 6/28/16.
 */

define(['jquery','GEvent'], function($,GEvent){

    function CanvasManager(EventManager){
        this.eventManager = EventManager;
        this.t_offset_X = s_x | 0; // Init to 0 if param not passed in.
        this.t_offset_Y = s_y | 0;
    }

    function Point(x,y){
        this.X = x;
        this.Y = y;
    }

    CanvasManager.prototype.init = function(){
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

                self.eventManager.handleCanvasEvent(new GEvent(GEvent.CNVS_DRG, "", []));
            }
        });

        canvas.mouseup(function(event){
            draggable = false;
            if(dragged){
            }
            else{
                self.eventManager.handleCanvasEvent(new GEvent(GEvent.CNVS_CLK, "", [event]));
            }
            dragged = false;
        });

    };

    return CanvasManager;
});