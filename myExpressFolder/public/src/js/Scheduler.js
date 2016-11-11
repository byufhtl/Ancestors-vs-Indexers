/**
 * Created by calvinm2 on 11/10/16.
 * The Flux Capacitor - It's what makes time travel possible.
 *
 */

define([],function(){

    /**
     * This class is designed to be the primary game event loop that will drive the __updates and the viewport rendering
     * for the entire program.
     * It's called the flux capacitor because it makes time travel possible.
     * The idea is that anything that requires changing on the next animation frame will occur here.
     * The __updates and renderers should be designed to simply require the time since the last update.
     * The __updates and renderers should be designed to not block the thread or take too long. Long
     * processes should be wrapped in Promises/other Async structures that can reassert themselves into the queue once
     * they have finished and are ready to go.
     */
    class Scheduler{

        /**
         * Flux Capacitor Constructor.
         * @constructor
         */
        constructor(){
            this.__updates = [[],[]];
            this.__renders = [[],[]];
            this.__currentUpdate = 0;
            this.__currentRender = 0;
            this.__engaged = false;
            this.__lastTime = 0;
            this.__eventHead = null;
        }

        /**
         * Starts the flux capacitor if it is not already __engaged.
         * Sets the update/render cycle up with at least one millisecond's worth of time artificially added to the
         * clock.
         */
        start(){
            if(!this.__engaged) {
                this.__lastTime = (new Date()).getMilliseconds() -1; // Guarantees a non-zero time from startup.
                this.__engaged = true;
                this.loop();
            }
        }

        /**
         * Stops the Flux Capacitor from queueing the next update/render cycle.
         * Only does something if the Flux Capacitor is currently __engaged.
         */
        stop(){
            if(this.__engaged){
                this.__engaged = false;
            }
        }

        /**
         * The primary event loop for the entire system. Runs continuously to update data and graphical interfaces.
         */
        loop(){
            // Update and track the elapsed time.
            let time = (new Date()).getMilliseconds();
            var dt = time - this.__lastTime;
            this.__lastTime = time;

            /*
            Fire any events that are ready to go through the DeltaClock.
            Done here to allow for the event __updates to make it in on this loop iteration.
            */
            this.__tick(dt);

            // Read the current bucket
            let to_update = this.__updates[this.__currentUpdate];
            let to_render = this.__renders[this.__currentRender];

            // Rotate the writers into another bucket.
            this.__currentUpdate = (++this.__currentUpdate)%this.__updates.length;
            this.__currentRender = (++this.__currentRender)%this.__renders.length;

            // Call the update events.
            while(to_update.length){
                to_update.shift().update(dt);
            }
            // Call the render events.
            while(to_render.length){
                to_render.shift().render(dt);
            }

            // Repeat the cycle.
            if(this.__engaged) {
                requestAnimationFrame(this.loop.bind(this));
            }
        }

        /**
         * Adds an event to the Flux Capacitor's internal scheduler. The events may optionally carry a delay that will
         * postpone the event firing.
         * Events are fired before buckets are changed, __updates are called, or __renders are processed. This makes __updates
         * spawned by events take enough priority to be updated and rendered in the same cycle as the release.
         * @param event The event to fire.
         * @param delay The delay (in milliseconds) before the event ought to be fired.
         */
        addEvent(event, delay = 0){
            var focus = this.__eventHead;
            if(!focus || focus.time > delay){
                this.__eventHead = {time:delay, action:event, next:focus};
                if(focus){
                    focus.time -= delay;
                }
            }
            else{
                delay -= this.__eventHead.time;
                while(focus.next){
                    if(delay < focus.next.time){
                        break;
                    }
                    delay -= focus.next.time;
                    focus = focus.next;
                }
                if(focus.next){
                    focus.next.time -= delay;
                }
                focus.next = {time:delay, action:event, next:focus.next};
            }
        }

        /**
         * Pops off any events that ought to happen in the current render cycle and calls their fire() method to let
         * them run.
         * @param dt The amount of time elapsed since the last tick.
         * @private This method is internally designed to mesh well with the clock.
         */
        __tick(dt){
            while(this.__eventHead && this.__eventHead.time <= dt){
                this.__eventHead.action.fire();
                dt -= this.__eventHead.time;
                this.__eventHead = this.__eventHead.next;
            }
            if(this.__eventHead){
                this.__eventHead.time -= dt;
            }
        }
        
        addUpdate(update){
            let u = this.__updates[this.__currentUpdate];
            // Prevent multiple update calls on the same updater.
            if(u.indexOf(update) != -1) return;
            u.push(update);
        }

        addRender(render){
            let r = this.__renders[this.__currentRender];
            // Prevent multiple render calls on the same renderer.
            if(r.indexOf(render) != -1) return;
            r.push(render);
        }
    }

    return Scheduler;
});