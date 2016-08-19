define(["jquery","util/Sig"],function($,Sig){

    var FamilySearchHandler = function(FS)
    {
        this.FS = FS;
        this.user = {};
        this.eightGens = {};
    };


    FamilySearchHandler.prototype.login = function() {
        var self = this;
        window.location.href = self.FS.getOAuth2AuthorizeURL();
    };

    FamilySearchHandler.prototype.getParameterByName = function(name) {
        name = (name == "Authcode" || name == "Authorization Code") ? "code" : name; // Make a few provisionary parallels.
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        var code = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        code = code.replace(new RegExp('/'), "");
        // console.log(code); // prints access token
        return code;
    };

    FamilySearchHandler.prototype.checkAccessToken = function(callback){
        var self = this;
        var validData = false;
        var url = window.location.href.split('?');
        if(url.length > 1){
                        var accessToken = self.getParameterByName('code');
                        // console.log("accesstokenis: " + accessToken); // prints access token
                        self.FS.getAccessToken(accessToken).then(function(newAccessToken){
                            localStorage.setItem("fs_access_token", self.FS.settings.accessToken);
                            self.getEightGens(function(response){
                                callback(response);
                            });
                });
        }
        else if (typeof(Storage) !== "undefined" && localStorage.getItem('fs_access_token')) {
                var accessToken = localStorage.getItem('fs_access_token');
                self.FS.getAccessToken(accessToken).then(function(newAccessToken){
                self.getEightGens(function(response){
                    callback(response);
                });
            });
        }
        else {
          callback(null);
        }
    };

    FamilySearchHandler.prototype.getEightGens = function(callback){
        var self = this;
        //get user and ID
        self.FS.getCurrentUser().then(function(response)
        {

            self.user = response.getUser();
            self.id = self.user.data.personId;
          var params = {
              generations: 8,
              personDetails: true,
              descendants: false
          };

          self.FS.getAncestry(self.id, params).then(function parse(ancestors){

              var listOfAncestors = ancestors.getPersons();
              for (var i = 0; i < listOfAncestors.length; i++)
              {
                    /* each person has under data.display
                        ascendancyNumber
                        birthDate
                        birthPlace
                        descendancyNumber
                        gender
                        lifespan
                        name
                     */
              }
              console.log("<<INITIALIZATION>> Ancestry Obtained!");
              callback(listOfAncestors);
          });
        });
    };

    /**
     * Provides a way of obtaining the current user's information, whether or not it has been fetched already. Makes
     * use of previously retrieved data where possible, unless the override variable is defined and set to true.
     * @returns {Promise} resolves with FS user data. rejects with null if request cannot succeed.
     */
    FamilySearchHandler.prototype.getCurrentUser = function(override){
        var self = this;
        return new Promise(function(resolve, reject){
            if(self.user && (self.user != {}) && !override){
                resolve(self.user);
            }
            else{
                self.FS.getCurrentUser().then(function resolved(user){
                    self.user = user;
                    resolve(user);
                },
                function failed(response){
                    console.log("<<ERROR-FS/API>> User could not be identified.", response);
                    resolve(null);
                })
            }
        });
    };

    FamilySearchHandler.prototype.matchPersonChangeHistory = function(personData, user){
        var self = this;
        return new Promise(function(resolve, reject){
            var url = "https://" + ((__development) ? ("beta.") : ("sandbox.")) + ("familysearch.org/platform/persons/" + personData.id + "/changes");
            console.log("<<DEBUG-AJAX>> TARGET URL:", url);
            self.FS.getPerson(personData.id).then(
                function success(response){
                    response.getPerson().getChanges().then(function success(changeLog){
                        var changes = changeLog.getChanges();
                        console.log("<<FS RETURN>> Changes:", changes);
                        var matches = 0;
                        var username = user.data.contactName;
                        for(var change of changes){
                            for(var contributor of change.data.contributors){
                                if(contributor.name == username){
                                    console.log("<<FS MATCHER>> MATCH!!!");
                                    matches = (change.data.updated > matches) ? change.data.updated : matches; // Logs the most recent change.
                                }
                            }
                        }
                        resolve(matches);
                    },
                    function failure(response){
                        console.log("<<FS RETURN>> Changelog failed or could not be found.");
                        resolve(response);
                    });
                },
                function failure(response){
                    console.log("<<FS RETURN>> Person could not be found.", this, response);
                    resolve(response)
                }
            )
        });
    };

    FamilySearchHandler.prototype.scanUser = function(onSuccess){
        var self = this;
        console.log("<<DEBUG>> Scan User in progress.");
        var promise = new Promise(function(resolve, reject){
            self.getCurrentUser().then(function(user){ //Retrieve the user's ID
                var userID = user.data.id;
                var url = (__development) ? ("https://beta.familysearch.org/platform/users/" + userID + "/history") : ("https://sandbox.familysearch.org/platform/users/" + userID + "/history");
                $.ajax(url,{ // Request the user's history
                    method: 'GET',
                    headers: {
                        Accept: "application/x-gedcomx-atom+json"
                    },
                    data: {
                        uid: userID,
                        // Authorization: "Bearer " + (self.getParameterByName('code')).toString(),
                        access_token: localStorage.getItem('fs_access_token')
                    }
                }).then(
                    function success(response){ // If the user's change history has been obtained
                        console.log("<<FAMILYSEARCH>> History obtained:", response);
                        resolve(response);
                    },
                    function failure(response){ // If the user's history was unobtainable
                        console.log("<<DEBUG>> History request rejected. this:", this, ".\nResponse:", response);
                        reject(response);
                    }
                );
            });
        });
        promise.then(function(histData){
            console.log("<<DEBUG>> Making request to callback.");
            onSuccess(histData);
        },
        function(response){
            console.log("<<DEBUG>> Promise failed:", response);
        });
    };
    return FamilySearchHandler;
});
