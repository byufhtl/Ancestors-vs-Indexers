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
        var origin;
        var buffer;

        canvas.mousedown(function(event){
            draggable = true;
            dragged = false;

            start = new Point(event.pageX, event.pageY);
            origin = new Point(self.viewTransform.getX(), self.viewTransform.getY());
            buffer = new Point(0, 0);
        });

        canvas.mousemove(function(event){
            if(draggable){
                var diff = new Point(event.pageX - start.X, event.pageY - start.Y);
                start = new Point(event.pageX, event.pageY);

                if(buffer) { // If we still have a buffer, keep going
                    buffer = new Point(buffer.X + diff.X, buffer.Y + diff.Y);
                    console.log(buffer);
                    // When we move out of the buffer, plug the buffer storage into the movement as well, then kill buffer.
                    if(buffer.X > 15 || buffer.X < -15 || buffer.Y > 15 || buffer.Y < -15){
                        //console.log("Killing buffer.");
                        diff = new Point(buffer.X, buffer.Y);
                        buffer =  null;
                        dragged = true;
                    }
                }

                if(buffer == null){
                    self.viewTransform.addX(diff.X);
                    self.viewTransform.addY(diff.Y);
                }

                self.eventManager.handleCanvasEvent(new GEvent(GEvent.CNVS_DRG, "", [])); // In case there are special drag effects
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