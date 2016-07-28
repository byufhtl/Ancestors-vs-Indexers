/**
 * Created by calvinmcm on 7/6/16.
 */

define(['jquery'],function($){

    function ServerFacade(){

    }

    ServerFacade.retrieveUserData = function(pid){
        var urlToHit = 'profile';
        var data = {id:pid};
        //data = JSON.stringify(data);
        console.log("data before sending to server: ", data);
        $.getJSON(urlToHit,data,function(data){
            console.log("harhar, the data from the database is.... ", data);
        });
    };

    ServerFacade.postUserData = function(objectToPost)
    {
        var myUser = {_id: "bilbo", data: {age: '999', height: '1232'}};
        $.ajax({
          url:'replace',
          type: "POST",
          data: JSON.stringify(myUser),
          contentType: "application/json",
          });
    }
    return ServerFacade;
});
