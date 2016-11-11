/**
 * Created by calvin on 7/8/16.
 * The Commander is in charge of managing the relationships between the controllers and the client-server services
 * such as Audio, HTML, and Image managers, the FS Manager, and the ServerManager.
 * It also handles the substitution of the viewManager and Model injection.
 */

///<reference path="../util/Signal.ts"

define(['FamilySearchHandler','game/ViewTransform', 'ServerFacade', 'audio/AudioManager',"controllers/ControllerTypes",
        "controllers/LoginController", "util/Signal","Scheduler","img/ImageManager","view/ViewManager"],
    function(FamilySearchHandler, ViewTransform, ServerFacade, AudioManager, CONTROL,LoginController,Signal,Scheduler,
    ImageManager,ViewManager){

    class Commander {

        constructor() {

            this.FSManager = null;
            this.serverManager = null;
            this.imageManager = null;
            this.audioManager = null;

            this.model = null;
            this.currController = null;
            this.viewController = null;

            this.controllers = {};

            this.scheduler = null;
        }

        init() {
            this.imageManager = new ImageManager();
            this.viewController = new ViewManager();
            this.scheduler = new Scheduler();
            this.scheduler.start();
            this.controllers[CONTROL.LOGIN] = new LoginController(this);
            this.switchControllerTo(CONTROL.LOGIN);
        };
        // INSTANCE DEFINITIONS ==========================================================================================[]

        switchControllerTo(controllerType) {
            this.activeController = this.controllers[controllerType];
            this.activeController.activate();
        };

        handleClick(pt) {
            return true;
        };

        handleDrag(pt1, pt2) {
            return true;
        };

        handleKey(event) {
            return true;
        };

        handle(signal) {
            switch (signal.type) {
                case Signal.FSREQUEST:
                    if (signal.value == Signal.DO_LOGIN) {
                        this.fsManager.login();
                    }
                    break;
            }
            console.log("Unrecognized command in the Commander", signal);
        };

        /**
         * Schedules the event onto the clock. The event will fire once it's delay has expired.
         * @pre event must implement the fire() method with no parameters.
         * @param event The event to schedule.
         * @param delay (OPTIONAL) A time delay (in milliseconds) to wait before the event should fire.
         */
        scheduleEvent(event, delay = 0){
            if(!event.hasOwnProperty("fire")) return;
            this.scheduler.addEvent(event, delay);
        }

        /**
         * Schedules the update for immediate execution
         * @pre update must implement the update() method with no parameters.
         * @param update the update to schedule for immediate execution.
         */
        scheduleUpdate(update){
            if(!event.hasOwnProperty("update")) return;
            this.scheduler.addUpdate(update);
        }

        /**
         * Schedules the render for immediate execution
         * @pre render must implement the render() method with no parameters.
         * @param render the render to schedule for immediate execution.
         */
        scheduleRender(render){
            if(!render.hasOwnProperty("render")) return;
            this.scheduler.addRender(render);
        }

        /**
         * Returns the ViewController if the current controller matches the input controller.
         * @param controller
         * @returns {*}
         */
        getView(controller){
            return (controller === this.activeController) ? this.viewController : null;
        }

        getImageManager(){
            return this.imageManager;
        }
    }
    return Commander;
});
