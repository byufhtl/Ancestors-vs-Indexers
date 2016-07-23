/**
 * Created by calvin on 7/8/16.
 */

define(['jquery','util/Order'],function($, Order){

    function LoaderUtils(){
        this.loaded = {};
        this.pending = {}; // Still pending
        this.failed = {};
        this.dead = {};
        this.remaining = 0;
    }

    /**
     * Checks to see if a given resource has loaded.
     * @param url
     * @returns {boolean}
     */
    LoaderUtils.prototype.hasResource = function(url){
        return this.loaded.hasOwnProperty(url);
    };

    LoaderUtils.prototype.getResource = function(url){
        return (this.hasResource(url))? this.loaded[url] : null;
    };

    /**
     * Places the entry in a determinant container (which is really just a big JSON map).
     * Resources that load properly are moved into the success map, those that repeatedly fail are added to the failure
     * map.
     * @param pending The place to hold pending requests
     * @param success The place to send successful requests
     * @param failure The place to send failed requests
     * @param entry The entry to process
     * @param tries The number of times to attempt to load a resource if it fails.
     */
    LoaderUtils.pend = function(pending, success, failure, entry, tries){
        return new Promise(function(resolve, reject){
            if(!pending.hasOwnProperty(entry.url)){ // If not pending.
                if(entry.url && (entry.url != '')) {
                    pending[entry.url] = entry.type;

                    // HTML LOAD REQUESTS

                    if (entry.type == Order.HTML) {
                        LoaderUtils.loadHTML(entry.url).then(
                            function (resolved) {
                                LoaderUtils.assign(pending, success, entry.url, resolved);
                                resolve();
                            },
                            function (rejected) {
                                if (tries == 0) {
                                    LoaderUtils.assign(pending, failure, entry.url, entry.type);
                                    reject(rejected);
                                }
                                else {
                                    delete pending[entry.url];
                                    LoaderUtils.pend(pending, success, failure, entry, --tries).then(
                                        function (resolved) {
                                            resolve(resolved);
                                        },
                                        function (rejected) {
                                            reject(rejected);
                                        }
                                    );
                                }
                            }
                        )
                    }

                    // IMAGE LOAD REQUESTS

                    else if (entry.type == Order.IMAGE) {
                        LoaderUtils.loadImage(entry.url).then(
                            function (resolved) { // Image Loading may not be sufficient to determine viability.
                                LoaderUtils.assign(pending, success, entry.url, resolved);
                                resolve();
                            },
                            function (rejected) {
                                console.log("Trying to reload resource", entry, "(" + tries + ") tries remaining");
                                if (tries == 0) {
                                    console.log("Permanent Loading Failure:", entry, tries);
                                    LoaderUtils.assign(pending, failure, entry.url, entry.type);
                                    reject();
                                }
                                else {
                                    delete pending[entry.url];
                                    LoaderUtils.pend(pending, success, failure, entry, --tries).then(
                                        function (resolved) {
                                            resolve(resolved);
                                        },
                                        function (rejected) {
                                            console.log("Could not pend resource request:", entry, tries);
                                            reject(rejected);
                                        }
                                    );
                                }
                            }
                        )
                    }

                    // UNKNOWN TYPE REQUESTS

                    else {
                        console.error("Invalid Resource Type. Cannot Load \"" + entry.type + "\"");
                        reject();
                    }
                }

                // Bad URL

                else {
                    console.error("Invalid URL on resource type \"" + entry.type + "\"");
                    reject();
                }
            }
            else{
                resolve();
            }
        });

    };

    /**
     * Removes an item from one Q and places it in a destination container
     * @param source The Q being removed from.
     * @param dest The Q being populated
     * @param key The key associated with the move.
     * @param value The value being assigned to the destination
     */
    LoaderUtils.assign = function(source, dest, key, value){
        dest[key] = value;
        delete source[key];
    };

    /**
     * Attempts to load a batch of resources.
     * Once all requests have returned, will either resolve(if all loaded properly), or reject with the number of failures.
     * @param order An array of JSON {url, type}
     * @returns {Promise}
     */
    LoaderUtils.prototype.loadResources = function(order){
        var self = this;
        return new Promise(function(resolve, reject){
            var count = Object.keys(order).length;
            var finished = 0;
            var failed = 0;
            for(var index in order.getBatches()) {
                if(order.getBatches().hasOwnProperty(index)) {
                    // pend the request
                    LoaderUtils.pend(self.pending, self.loaded, self.failed, order.getBatches()[index], self.remaining, order.getBatches()[index].tries).then(
                        function (resolved) {
                            if (++finished == count) {
                                if (!failed) {
                                    resolve(resolved);
                                }
                                else {
                                    reject(failed);
                                }
                            }
                        },
                        function (rejected) {
                            failed++;
                            if (++finished == count) {
                                if (!failed) {
                                    resolve(rejected);
                                }
                                else {
                                    reject(failed);
                                }
                            }
                        }
                    );
                }
            }
        });
    };

    /**
     * Loads an image as an ES6 Promise.
     * Resolves if it loads successfully.
     * Otherwise rejects, assuming I've got the function names right...
     * @param url the URL for the image.
     * @returns {Promise}
     */
    LoaderUtils.loadImage = function(url){
        return new Promise(function(resolve, reject){
            var image = new Image();
            image.onload = function() {
                resolve(image);
            };
            image.onerror = function() {
                reject();
            };
            image.src = url;
        });
    };

    /**
     * Loads an image as an ES6 Promise.
     * Resolves if it loads successfully.
     * Otherwise rejects.
     * @param url the URL for the image.
     * @returns {Promise} Resolved: Div container with requested HTML within.
     */
    LoaderUtils.loadHTML = function(url){
        return new Promise(function(resolve, reject){
            var container = $('<div></div>');
            container.css('margin', '0px');
            container.css('padding', '0px');
            container.css('width', "100%");
            container.css('height', "100%");
            container.empty();
            container.load(url, function (response) {
                if (response) {
                    resolve(container);
                }
                else {
                    reject()
                }
            });
        });
    };

    return LoaderUtils;
});