/**
 * Created by calvinmcm on 6/21/16.
 */
var __development = 0;
require.config({
    baseUrl: 'src',
    paths: {
        scripter: 'scripter',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min'
    },
    shim: {
        scripter: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'bootstrap', 'scripter'],function($, Bootstrap, Scripter){
    var header = "[]===================================================================[]";
    console.log(header, "\n\tRecordHunter Script Creator\n", header, "\n\n");
    var scripter = new Scripter(0);
    scripter.init();
});
