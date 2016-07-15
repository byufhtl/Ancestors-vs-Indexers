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

    ServerFacade.postUserData = function(objectToPost)
    {
        var myUser = new user({_id: "bilbo", data: {age: '1232', height: '1232'}});
        $.ajax({
          url:'replace',
          type: "POST",
          data: JSON.stringinfy(myUser),
          contentType: "application/json",
          });
    }
});
