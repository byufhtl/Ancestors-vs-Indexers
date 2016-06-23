define([],function() {

    function VictoryDefeatHandler() {

    }

    VictoryDefeatHandler.prototype.victory = function(myRender, controller)
    {
        console.log("YOU WON!!!");
        myRender.renderVictory();
        var topbarContainer = $('#topbar');
        topbarContainer.empty();
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
        sidebarContainer.load("src/html/victory.html", function(response){
            console.log((response) ? ("Buildings sidebar loaded with response: " + response) : ("Buildings sidebar loaded with no response."));
            $('#nextLevelButton').click(function(){
              console.log("PUSHED NEXT LEVEL BUTTON");
                controller.initializeGame((controller.currentLevel + 1), {});
                controller.loop();
            });
        });

    }

    VictoryDefeatHandler.prototype.defeat = function(myRender)
    {
        console.log("YOU SUCK AT THIS GAME");
        myRender.renderDefeat();
        var topbarContainer = $('#topbar');
        topbarContainer.empty();
        var sidebarContainer = $('#sidebar');
        sidebarContainer.empty();
        sidebarContainer.load("src/html/defeat.html", function(response){
            console.log((response) ? ("Buildings sidebar loaded with response: " + response) : ("Buildings sidebar loaded with no response."));
        });
    }

    return VictoryDefeatHandler;

});
