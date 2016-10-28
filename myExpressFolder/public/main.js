/**
 * Created by calvinmcm on 6/21/16.
 */
var __development = 0;
require.config({
    baseUrl: 'src/js',
    paths: {
        commander: 'commander/Commander',
        familysearch: 'https://cdn.jsdelivr.net/familysearch-javascript-sdk/2.4.5/familysearch-javascript-sdk.min',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min'
    },
    shim: {
        spleash: {
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

require(['jquery', 'familysearch', 'bootstrap', 'commander'],function($, FamilySearch, Bootstrap, Commander){
    var header = "[]===================================================================[]";
    console.log(header, "\n\tFinalreFactory Code Base\n", header, "\n\n");
    var myUser = {_id: "bilbo", data: {age: '1232', height: '1232'}};
    var FS = null;
    if(__development) {
         FS = new FamilySearch({
            // Copy your app key into the client_id parameter
            client_id: 'a02j000000HBHf4AAH',
            redirect_uri: 'http://127.0.0.1:3005',
            save_access_token: true,
            environment: 'sandbox'
        });
    }
    else{
        FS = new FamilySearch({
            // Copy your app key into the client_id parameter
            client_id: 'a02j000000CBcjqAAD',
            redirect_uri: 'http://127.0.0.1:8080',
            save_access_token: true,
            environment: 'sandbox'
        });
    }
    console.log(Commander);
    let commander = new Commander();
    commander.init();
    // var splash = new Splash(FS);
    // splash.init();
});
