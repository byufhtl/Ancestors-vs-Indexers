/**
 * Created by calvinmcm on 7/6/16.
 */

define(['jquery'],function($){

    function ServerFacade(){

    }

    ServerFacade.retrieveUserData = function(pid){
        var urlToHit = 'profile';
        $.getJSON(urlToHit, function(data){
            console.log(data);
        });
    };

    ServerFacade.postUserData = function(pid, userProfile){
        var profileJSON = JSON.stringify(userProfile);
        var urlToHit = "setPerson";
        $.ajax({
                  url: urlToHit,
                  type: "POST",
                  data : profileJSON,
                  contentType: "application/json; charset=utf-8"
              });
    };
});
