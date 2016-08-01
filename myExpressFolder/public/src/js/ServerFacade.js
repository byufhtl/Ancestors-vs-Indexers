/**
 * Created by calvinmcm on 7/6/16.
 */

define(['jquery'],function($){

    function ServerFacade(){

    }

    ServerFacade.retrieveUserData = function(pid){
        return new Promise(function(resolve, reject){

            var urlToHit = 'profile';
            var data = {id:pid};
            //data = JSON.stringify(data);
            console.log("data before sending to server: ", data);
            $.getJSON(urlToHit,data,function(data) {
                console.log("harhar, the data from the database is.... ", data);
                resolve(data);
            }).fail(function(data){
                console.log("Database retrieval failed...");
                resolve(null);
            });
        });

    };

    ServerFacade.postUserData = function(objectToPost)
    {
        $.ajax({
          url:'replace',
          type: "POST",
          data: JSON.stringify(objectToPost),
          contentType: "application/json"
          });
    };
    return ServerFacade;
});
