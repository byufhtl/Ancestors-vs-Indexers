define(["jquery","GEvent", "familysearch"],function($,GEvent,FamilySearch){

    var FamilySearchHandler = function()
    {
        this.user = {};
        this.eightGens = {};
        this.FS = new FamilySearch({
            // Copy your app key into the client_id parameter
            client_id: 'a02j000000HBHf4AAH',
            redirect_uri: 'http://127.0.0.1:8080',
            save_access_token: true,
            environment: 'sandbox',
        });
    };


    Login.prototype.login = function() {
        var self = this;
        window.location.href = self.FS.getOAuth2AuthorizeURL();
    };


    var getParameterByName = function(name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    var checkAccessToken = function(){
        var self = this;
        var url = window.location.href.split('?');
        if(url.length > 1){
            this.getAccessToken(getParameterByName('code')).then(function(accessToken){
            //set access token here
            localStorage.setItem("fs_access_token", accessToken);
          })
        }
        else if (typeof(Storage) !== "undefined" && localStorage.getItem('fs_access_token')) {
            self.settings.accessToken = localStorage.getItem('fs_access_token');
        }
        else {
            self.login();
        }
    };


    Login.prototype.getEightGens = function()
    {
        var self = this;
        //get user and ID
        self.FS.getCurrentUser().then(function(response)
        {
            self.user = response.getUser();
            self.id = user.getId();

          //get generations
          var params = {
              generations: 8,
              personDetails: true,
              descendants: false,
          };

          self.FS.getAncestry(id, params).then(function parse(ancestors){
              listOfAncestors = ancestors.getPersons();
              console.log("Ancestors", ancestors);
              for (var i = 0; i < listOfAncestors.length; i++)
              {

              }
          });
        });
    }

    return Login;
});
