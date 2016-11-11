
define(["img/ImageManager"],function(ImageManager){
    class LoginController{
        constructor(boss) {
            this.boss = boss;
        }

        // CONTROLLER METHODS ========================================================================================[]

        activate(){
            let self = this;
            function fail(failure){
                console.log("Login Screen images were unable to load.");
            }
            this.boss.getImageManager().loadLoginImages().then(
                function(success){
                    let renderreq = self.buildRenderRequest();
                    if(!renderreq){fail();}
                    self.boss.scheduleRender(renderreq)
                },fail
            );
            return true;
        };
        handleClick(pt) {
            // Doesn't do much for now.
            return true;
        };
        handleDrag(pt1, pt2) {
            // Dragging does nothing on this controller.
            return true;
        };
        handleKey(event) {
            // No current usage
            return true;
        };
        handle(signal) {
            // Nothing to do here for now.
        };

        // CONTROLLER LOGIC ==========================================================================================[]

        buildRenderRequest(){
            let self = this;
            return{
                render:function(){
                    let lgnscn = self.boss.getImageManager().getImage(ImageManager.LOGINSCN);
                    if(!lgnscn) { return null; }
                    self.boss.getView(self).drawBackdrop(lgnscn);
                }
            }
        }


    }

    return LoginController;
});