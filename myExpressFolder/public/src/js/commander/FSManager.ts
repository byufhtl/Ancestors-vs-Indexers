/**
 * Created by calvinm2 on 10/26/16.
 */

///<reference path="../util/jsDeclarations.ts"/>
///<reference path="../controllers/AbstractController.ts"/>
///<amd-dependency path="" />
class FSManager{

    private fs :any;
    private user: any;
    private eightGens: any[];
    private __next_id: any;
    private __access_level :string;

    constructor(){
        this.fs = FS;
        this.__access_level = "beta"
    }

    public login(){
        var self = this;
        window.location.href = this.fs.getOAuth2AuthorizeURL();
    }

    public getParameterByName(name: string): any{
            name = (name == "Authcode" || name == "Authorization Code") ? "code" : name; // Make a few provisionary parallels.
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            var code = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
            code = code.replace(new RegExp('/'), "");
            // console.log(code); // prints access token
            return code;
    }

    public checkAccessToken(callback) {
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
        else if (typeof(Storage) !== "undefined" && localStorage.getItem('fs_access_token')) {
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
    }

    public getEightGenerations(callback){
        var self = this;
        //get user and ID
        this.fs.getCurrentUser().then(function(response)
        {

            self.user = response.getUser();
            self.__next_id = self.user.data.personId;
            var params = {
                generations: 8,
                personDetails: true,
                descendants: false
            };

            self.fs.getAncestry(self.__next_id, params).then(function parse(ancestors){

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
    }

    public getCurrentUser(override = false){
        var self = this;
        return new Promise(function(resolve, reject){
            if(self.user && (self.user != {}) && !override){
                resolve(self.user);
            }
            else{
                self.fs.getCurrentUser().then(function resolved(user){
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

    public matchPersonChangeHistory(personData, user){
        var self = this;
        return new Promise(function(resolve, reject){
            var url = "https://" + self.__access_level + (".familysearch.org/platform/persons/" + personData.__next_id + "/changes");
            // console.log("<<DEBUG-AJAX>> TARGET URL:", url);
            self.fs.getPerson(personData.__next_id).then(
                function success(response){
                    response.getPerson().getChanges().then(function success(changeLog){
                            var changes = changeLog.getChanges();
                            // console.log("<<FS RETURN>> Changes:", changes);
                            var matches = 0;
                            var username = user.data.contactName;
                            for(var change of changes){
                                for(var contributor of change.data.contributors){
                                    if(contributor.name == username){
                                        // console.log("<<FS MATCHER>> MATCH!!!");
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

    public scanUser(onSuccess){
        var self = this;
        console.log("<<DEBUG>> Scan User in progress.");
        var promise = new Promise(function(resolve, reject){
            self.getCurrentUser().then(function(user){ //Retrieve the user's ID
                var userID = user.data.__next_id;
                var url = "https://" + self.__access_level + ".familysearch.org/platform/users/" + userID + "/history";
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
                        console.log("<<FAMILYSEARCH>> History request rejected. this:", this, ".\nResponse:", response);
                        reject(response);
                    }
                );
            });
        });
        promise.then(function(histData){
                onSuccess(histData);
            },
            function(response){
                console.log("<<FAMILYSEARCH>> Promise failed:", response);
            }
        );
    };
}

export {FSManager};
// export = FSManager;