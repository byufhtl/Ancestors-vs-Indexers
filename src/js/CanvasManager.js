/**
 * Created by calvinmcm on 6/28/16.
 */

define(['jquery', 'GEvent', 'Point', 'ViewTransform'], function($, GEvent, Point, ViewTransform){

    function CanvasManager(eventManager, viewTransform){
        this.eventManager = eventManager;
        this.viewTransform = viewTransform;
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

                self.viewTransform.addX(diff.X);
                self.viewTransform.addY(diff.Y);

                self.eventManager.handleCanvasEvent(new GEvent(GEvent.CNVS_DRG, "", []));
            }
        });

        canvas.mouseup(function(event){
            draggable = false;
            if(!dragged){
                var pt = self.viewTransform.WtoV(new Point(event.pageX, event.pageY));
                self.eventManager.handleCanvasEvent(new GEvent(GEvent.CNVS_CLK, "", [pt]));
            }
            dragged = false;
        });

    };



    return CanvasManager;
});