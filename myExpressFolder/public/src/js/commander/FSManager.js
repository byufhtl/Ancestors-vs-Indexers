/**
 * Created by calvinm2 on 10/26/16.
 */
"use strict";
///<reference path="../util/jsDeclarations.ts"/>
///<reference path="../controllers/AbstractController.ts"/>
var FSManager = (function () {
    function FSManager() {
        this.fs = FS;
        this.__access_level = "beta";
    }
    FSManager.prototype.login = function () {
        var self = this;
        window.location.href = this.fs.getOAuth2AuthorizeURL();
    };
    FSManager.prototype.getParameterByName = function (name) {
        name = (name == "Authcode" || name == "Authorization Code") ? "code" : name; // Make a few provisionary parallels.
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        var code = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        code = code.replace(new RegExp('/'), "");
        // console.log(code); // prints access token
        return code;
    };
    FSManager.prototype.checkAccessToken = function (callback) {
        var self = this;
        var validData = false;
        var url = window.location.href.split('?');
        if (url.length > 1) {
            var accessToken = self.getParameterByName('code');
            // console.log("accesstokenis: " + accessToken); // prints access token
            this.fs.getAccessToken(accessToken).then(function (newAccessToken) {
                localStorage.setItem("fs_access_token", self.fs.settings.accessToken);
                self.getEightGenerations(function (response) {
                    callback(response);
                });
            });
        }
        else if (typeof (Storage) !== "undefined" && localStorage.getItem('fs_access_token')) {
            var accessToken = localStorage.getItem('fs_access_token');
            this.fs.getAccessToken(accessToken).then(function (newAccessToken) {
                self.getEightGenerations(function (response) {
                    callback(response);
                });
            });
        }
        else {
            callback(null);
        }
    };
    FSManager.prototype.getEightGenerations = function (callback) {
        var self = this;
        //get user and ID
        this.fs.getCurrentUser().then(function (response) {
            self.user = response.getUser();
            self.__next_id = self.user.data.personId;
            var params = {
                generations: 8,
                personDetails: true,
                descendants: false
            };
            self.fs.getAncestry(self.__next_id, params).then(function parse(ancestors) {
                var listOfAncestors = ancestors.getPersons();
                for (var i = 0; i < listOfAncestors.length; i++) {
                }
                console.log("<<INITIALIZATION>> Ancestry Obtained!");
                callback(listOfAncestors);
            });
        });
    };
    FSManager.prototype.getCurrentUser = function (override) {
        if (override === void 0) { override = false; }
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.user && (self.user != {}) && !override) {
                resolve(self.user);
            }
            else {
                self.fs.getCurrentUser().then(function resolved(user) {
                    self.user = user;
                    resolve(user);
                }, function failed(response) {
                    console.log("<<ERROR-FS/API>> User could not be identified.", response);
                    resolve(null);
                });
            }
        });
    };
    ;
    FSManager.prototype.matchPersonChangeHistory = function (personData, user) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var url = "https://" + self.__access_level + (".familysearch.org/platform/persons/" + personData.__next_id + "/changes");
            // console.log("<<DEBUG-AJAX>> TARGET URL:", url);
            self.fs.getPerson(personData.__next_id).then(function success(response) {
                response.getPerson().getChanges().then(function success(changeLog) {
                    var changes = changeLog.getChanges();
                    // console.log("<<FS RETURN>> Changes:", changes);
                    var matches = 0;
                    var username = user.data.contactName;
                    for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
                        var change = changes_1[_i];
                        for (var _a = 0, _b = change.data.contributors; _a < _b.length; _a++) {
                            var contributor = _b[_a];
                            if (contributor.name == username) {
                                // console.log("<<FS MATCHER>> MATCH!!!");
                                matches = (change.data.updated > matches) ? change.data.updated : matches; // Logs the most recent change.
                            }
                        }
                    }
                    resolve(matches);
                }, function failure(response) {
                    console.log("<<FS RETURN>> Changelog failed or could not be found.");
                    resolve(response);
                });
            }, function failure(response) {
                console.log("<<FS RETURN>> Person could not be found.", this, response);
                resolve(response);
            });
        });
    };
    ;
    FSManager.prototype.scanUser = function (onSuccess) {
        var self = this;
        console.log("<<DEBUG>> Scan User in progress.");
        var promise = new Promise(function (resolve, reject) {
            self.getCurrentUser().then(function (user) {
                var userID = user.data.__next_id;
                var url = "https://" + self.__access_level + ".familysearch.org/platform/users/" + userID + "/history";
                $.ajax(url, {
                    method: 'GET',
                    headers: {
                        Accept: "application/x-gedcomx-atom+json"
                    },
                    data: {
                        uid: userID,
                        // Authorization: "Bearer " + (self.getParameterByName('code')).toString(),
                        access_token: localStorage.getItem('fs_access_token')
                    }
                }).then(function success(response) {
                    console.log("<<FAMILYSEARCH>> History obtained:", response);
                    resolve(response);
                }, function failure(response) {
                    console.log("<<FAMILYSEARCH>> History request rejected. this:", this, ".\nResponse:", response);
                    reject(response);
                });
            });
        });
        promise.then(function (histData) {
            onSuccess(histData);
        }, function (response) {
            console.log("<<FAMILYSEARCH>> Promise failed:", response);
        });
    };
    ;
    return FSManager;
}());
module.exports = FSManager;
//# sourceMappingURL=FSManager.js.map