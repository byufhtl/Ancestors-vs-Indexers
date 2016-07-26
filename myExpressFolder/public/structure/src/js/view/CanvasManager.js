/**
 * Created by calvinmcm on 6/28/16.
 */

define(['jquery', 'util/Sig', 'util/Point'], function($, Sig, Point){

    function CanvasManager(viewController, viewTransform){
        this.viewController = viewController;
        this.viewTransform = viewTransform;
    }

    CanvasManager.prototype.init = function() {
        var canvasContainer = $('#canvas');
        var canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 600;
        canvas.id = 'canvas';
        canvasContainer.append(canvas);
        this.canvas = canvas;

        this.initClicking();
        this.initKeys();

        return canvas;
    };

    CanvasManager.prototype.initClicking = function(){
        var self = this;


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

        // Allows for dragging - TODO DRAGS EVEN IF CURSOR LEAVES THE CANVAS
        canvas.mousemove(function(event){
            var wToVPt = self.viewTransform.WtoV(new Point(event.pageX, event.pageY));
            var onCanvas = (wToVPt.X >= 0 && wToVPt.X <= 1000 && wToVPt.Y >= 0 && wToVPt.Y <= 600);
            var inCanvas = true;
            if(draggable && onCanvas){
                var diff = new Point(event.pageX - start.X, event.pageY - start.Y);
                start = new Point(event.pageX, event.pageY);

                if(buffer) { // If we still have a buffer, keep going
                    buffer = new Point(buffer.X + diff.X, buffer.Y + diff.Y);
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

                self.viewController.handle(new Sig(Sig.CNVS_DRG, "", [])); // In case there are special drag effects
            }
        });

        canvas.mouseup(function(event){
            draggable = false;
            if(!dragged){
                var pt = self.viewTransform.WtoV(new Point(event.pageX, event.pageY));
                self.viewController.handle(new Sig(Sig.CNVS_CLK, "", [pt]));
            }
            dragged = false;
        });

    };

    CanvasManager.prototype.initKeys = function(){
        var lastPress = null;
        var self = this;
        var keys = [];

        function moveIt(now){
            var move = 10;
            if(lastPress){
                move *= (now - lastPress)/100;
                move = (move > 10) ? 10 : move;
            }
            else{
                move *= 1;
            }
            console.log("Move:", move);
            lastPress = now;
            var moveBy = new Point(0,0);
            for(var index in keys){
                switch(keys[index]){
                    case "up":
                        moveBy.Y -= move;
                        break;
                    case "down":
                        moveBy.Y += move;
                        break;
                    case "left":
                        moveBy.X -= move;
                        break;
                    case "right":
                        moveBy.X += move;
                        break;
                }
            }
            self.viewTransform.addX(moveBy.X);
            self.viewTransform.addY(moveBy.Y);
        }

        $(document).keydown(function(e){
            e.preventDefault();
            var thisPress = Date.now();
            if(e.which == 119 || e.which == 38){ // w or (^) key - up
                if(keys.indexOf('up') == -1) {
                    keys.push('up');
                }
            }
            if(e.keyCode == 115 || e.keyCode == 40){ // s or (v) key - down
                if(keys.indexOf('down') == -1) {
                    keys.push('down');
                }
            }
            if(e.keyCode == 197 || e.keyCode == 37){ // a or (<) key - left
                if(keys.indexOf('left') == -1) {
                    keys.push('left');
                }
            }
            if(e.keyCode == 100 || e.keyCode == 39){ // d or (>) key - right
                if(keys.indexOf('right') == -1) {
                    keys.push('right');
                }
            }
            moveIt(thisPress);
        });

        $(document).keyup(function(e){
            if(e.which == 119 || e.which == 38){ // w or (^) key - up
                keys.splice(keys.indexOf('up'),1);
            }
            else if(e.keyCode == 115 || e.keyCode == 40){ // s or (v) key - down
                keys.splice(keys.indexOf('down'),1);
            }
            else if(e.keyCode == 197 || e.keyCode == 37){ // a or (<) key - left
                keys.splice(keys.indexOf('left'),1);
            }
            else if(e.keyCode == 100 || e.keyCode == 39){ // d or (>) key - right
                keys.splice(keys.indexOf('right'),1);
            }
            if(keys.length == 0){lastPress = null;}
        });
    };

    CanvasManager.prototype.release = function(){
        $(document).off('keydown keyup');
        $('#canvas').off('mousedown mousemove mouseup');
    };

    return CanvasManager;
});
