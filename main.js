/**
 * Created by calvinmcm on 6/21/16.
 */

require.config({
    baseUrl: 'src/js',
    paths: {
        runLvl1: 'TempRunLvl1',
        familysearch: 'https://cdn.jsdelivr.net/familysearch-javascript-sdk/2.1.0/familysearch-javascript-sdk.min',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min'
    },
    shim: {
        runLvl1: {
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

require(['jquery', 'familysearch', 'bootstrap', 'runLvl1'],function($, FamilySearch, Bootstrap, runLvl1){
    var canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    canvas.id = 'canvas';
    $('#canvas-div').append(canvas);

    //var context = canvas[0].getContext('2d');

    //context.fillStyle = "#ADFF2F";
    //context.fillRect(0, 0, canvas.width(), canvas.height());
    var myLevel1 = new runLvl1();
    myLevel1.run(canvas);
});
