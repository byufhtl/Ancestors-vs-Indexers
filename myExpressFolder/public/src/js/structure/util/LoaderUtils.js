/**
 * Created by calvin on 7/8/16.
 */

define(['jquery'],function($){

    function LoaderUtils(){
        this.loaded = {};
        this.pending = {}; // Still pending
        this.failed = {};
        this.dead = {};
    }

    /**
     * Checks to see if a given resource has loaded.
     * @param url
     * @returns {boolean}
     */
    LoaderUtils.prototype.hasResource = function(url){
        return this.loaded.hasOwnProperty(url);
    };


    LoaderUtils.prototype.deQ = function(name){
        
    }
    /**
     * Gets a resource, if possible.
     * @param url The url of the resource being retrieved.
     * @returns {Promise}
     */
    LoaderUtils.prototype.loadResources = function(url){
        var self = this;
        return new Promise(function(resolve, reject){
            if(self.loaded.hasOwnProperty(url)){ // If already loaded, return the object
                resolve(self.loaded[url]);
            }
            else{
                self.saveResource(url).then(   // Attempt to save the resource
                    function(response){ // Resource was successfully saved
                        resolve(self.loaded[url]);
                        if(self.pending.hasOwnProperty(url)) {
                            delete self.pending[url]; // Remove from the pending queue.
                        }
                    },
                    function(response){ // Resource did not load.
                        reject();
                    }
                )
            }
        });
    };

    /**
     * Attempts to retrieve and save a resource. The returned promise rejects if the resource was not able to load.
     * @param url
     * @returns {Promise}
     */
    LoaderUtils.prototype.saveResource = function(url){
        var self = this;
        return new Promise(function(resolve, reject){
            var count = (self.failed.hasOwnProperty(url)) ? self.failed[url] : 0;
            self.pendResource(url, count); // Puts the resource in the pending set if needed
            self.pending[url].then(
                function(response){ // If the resource was able to load.
                    self.loaded[url] = response; // Place in loaded set
                    if(self.failed.hasOwnProperty(url)){ // If there were any previous failures, clear them.
                        delete self.failed[url];
                    }
                    resolve(self.loaded[url]); // resolve
                },
                function(response){ // If the resource permanently failed to load
                    console.log("Item [" + url + "] has failed to load.");
                    self.failed[url] = response;
                    reject(response);
                }
            )
        });
    };

    /**
     * Puts the resource in the pending set.
     * @param url
     */
    LoaderUtils.prototype.pendResource = function(url, count){
        var self = this;
        count = (count) ? count : 0;
        if(!self.pending.hasOwnProperty(url)){ // If not pending.
            self.pending[url] = new Promise(function(resolve, reject){ // Load a promise into the pending queue
                var container = $('<div></div>');
                container.css('margin','0px');
                container.css('padding','0px');
                container.empty();
                container.load(url, function (response) {
                    if (response) {
                        resolve(container);
                    }
                    else{
                        reject(++count);
                    }
                });
            });
        }
    };

    /**
     * Attempts to reload all resources that have failed to load previously. May try repeatedly along a recursive strategy.
     * @param times The maximum number of times to retry.
     * @returns {*}
     */
    LoaderUtils.prototype.retry = function(times){
        // Single threaded JS? No mutex in place.

        if(times == 0){
            return new Promise(function(resolve){resolve()})
        }
        var self = this;
        return new Promise(function(resolve, reject){
            var failed;
            var count = 0;
            for (var prop in self.failed) {
                count++;
                if (self.failed.hasOwnProperty(prop)) {
                    self.saveResource(prop).then(
                        function (resolved) {
                            if (self.pending.hasOwnProperty(prop)) {
                                delete self.pending[prop]; // Remove from the pending queue.
                                if (--count == 0) {
                                    resolve(failed);
                                }
                            }
                        },
                        function (rejected) {
                            ++failed;
                            if (--count == 0) {
                                resolve(failed);
                            }
                        }
                    )
                }
            }
        }).then(
            function (resolved) {
                if (resolved > 0) {
                    if (times > 1) {
                        return self.retry(--times); // recurse.
                    }
                }
                return Promise.resolve();
            }
        );

    };

    return LoaderUtils;
});