/**
 * Created by calvinmcm on 6/21/16.
 */

require.config({
    baseUrl: 'src/js',
    paths: {
        familysearch: 'https://cdn.jsdelivr.net/familysearch-javascript-sdk/2.1.0/familysearch-javascript-sdk.min',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min'
    },
    shim: {
        familysearch:{
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'familysearch', 'bootstrap'],function($, FamilySearch, Bootstrap){
    var canvas = $('#canvas');
    var context = canvas[0].getContext('2d');
    context.fillStyle = "#ADFF2F";
    context.fillRect(0, 0, canvas.width(), canvas.height());
});

