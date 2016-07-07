/**
 * Created by calvinmcm on 7/6/16.
 */

define(['jquery'],function($){

    function ServerFacade(){

    }

    ServerFacade.retrieveUserData = function(pid){

    };

    ServerFacade.postUserData = function(pid, userProfile){
        var profileJSON = JSON.stringify(userProfile);
        $.ajax("localhost:27017",
            {
                data : profileJSON
            })
    };

});