/**
 * Created by calvinm2 on 11/10/16.
 *
 * This class is designed to wrap around the game canvas to make drawing things easier.
 */

define(['jquery'],function($){
    class ViewManager{
        constructor(){
            this.viewdiv = null;
            this.canvas = null;
            this.__init();
        }

        __init(){
            this.viewdiv = $('#view-content');
            this.canvas = document.createElement('canvas');
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight - 65;
            this.viewdiv.append(this.canvas);
            // init click handlers
        }

        drawBackdrop(image){
            let ctx = this.canvas.getContext("2d");
            console.log(image);
            ctx.drawImage(image, 0, 0);
        }
    }
    return ViewManager;
});
