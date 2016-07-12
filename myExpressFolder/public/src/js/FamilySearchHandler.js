define(["jquery","GEvent"],function($,GEvent){

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
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        var code = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        code = code.replace(new RegExp('/'), "");
        return code;
    };

    FamilySearchHandler.prototype.checkAccessToken = function(callback){
        var self = this;
        var validData = false;
        var url = window.location.href.split('?');
        if(url.length > 1){
                        var accessToken = self.getParameterByName('code');
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
        callback(null);
    };


    FamilySearchHandler.prototype.getEightGens = function(callback)
    {
        var self = this;
        //get user and ID
        self.FS.getCurrentUser().then(function(response)
        {

            self.user = response.getUser();
            self.id = self.user.data.personId;
          var params = {
              generations: 8,
              personDetails: true,
              descendants: false,
          };

          self.FS.getAncestry(self.id, params).then(function parse(ancestors){

              listOfAncestors = ancestors.getPersons();
              for (var i = 0; i < listOfAncestors.length; i++)
              {
                    //console.log(listOfAncestors[i].getPersonPortraitUrl("noURLEXISTS.jpg"));
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
              callback(listOfAncestors);
          });
        });
    };

    return FamilySearchHandler;
});
