/**
 * Created by calvinmcm on 6/21/16.
 */

require.config({
    baseUrl: 'src/js',
    paths: {
        splash: 'Splash',
        familysearch: 'https://cdn.jsdelivr.net/familysearch-javascript-sdk/2.4.5/familysearch-javascript-sdk.min',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min'
    },
    shim: {
        splash: {
            deps: ['jquery']
        },
        familysearch:{
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'familysearch', 'bootstrap', 'splash'],function($, FamilySearch, Bootstrap, Splash){
    var myUser = {_id: "bilbo", data: {age: '1232', height: '1232'}};

    $.ajax({
      url:'replace',
      type: "POST",
      data: JSON.stringify(myUser),
      contentType: "application/json",
    });

    $.ajax({

    })

    var FS = new FamilySearch({
        // Copy your app key into the client_id parameter
        client_id: 'a02j000000HBHf4AAH',
        redirect_uri: 'http://127.0.0.1:8080',
        save_access_token: true,
        environment: 'sandbox'
    });
    var splash = new Splash(FS);
    splash.init();
});
