/**
 * Created by calvin on 7/30/16.
 */

define([],function(){

    /**
     * Delta Clock
     * A system for time-managing regularly scheduled functions.
     * Events are added via the .add() function. The time till fire is added as well. From there the clock operates as
     * follows:
     * Lets say there are 4 tasks to be added with the following delays:
     * A:1 sec
     * B:2 sec
     * C:2 sec
     * D:7 sec
     *
     * The clock will schedule tasks on a next-up basis, storing the times incrementally so that the time left on a task
     * is the sum of all tasks ahead of it plus it's own time. Thus the clock looks like this:
     * A: 1
     * B: 1   (A+B = 2 total seconds left)
     * C: 0   (No additional wait after B)
     * D: 5   (5 seconds after C fires)
     *
     * The .tick() function fires all actions within that time scope and removes them from the clock. The first non-fired
     * event has it's time decremented accordingly.
     * @constructor
     */
    function DeltaClock(){
        this.head = null;
    }

    DeltaClock.prototype.add = function(time, action, params){
        var self = this;
        var focus = self.head;
        if(!focus || focus.time > time){
            self.head = {time:time, action:action, params:params, next:focus};
            if(focus){
                focus.time -= time;
            }
        }
        else{
            time -= self.head.time;
            while(focus.next){
                if(time < focus.next.time){
                    break;
                }
                time -= focus.next.time;
                focus = focus.next;
            }
            if(focus.next){
                focus.next.time -= time;
            }
            focus.next = {time:time, action:action, params:params, next:focus.next};
        }
    };

    DeltaClock.prototype.tick = function(dt){
        var self = this;
        while(self.head && self.head.time <= dt){
            self.head.action(self.head.params);
            dt -= self.head.time;
            self.head = self.head.next;
        }
        if(self.head){
            self.head.time -= dt;
        }
        console.log("tock...");
    };

    return DeltaClock;
});