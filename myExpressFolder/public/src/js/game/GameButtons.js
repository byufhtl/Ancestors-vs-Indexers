define(['util/Sig'],function(Sig) {

    function GameButtons() {
    }


    GameButtons.addNextlevelButton = function () {

    };

    GameButtons.addPlayAgainButton = function() {

    };

    GameButtons.addMainMenuButton = function() {

    };

    GameButtons.addVictoryButtons = function() {
        GameButtons.addNextlevelButton();
        GameButtons.addMainMenuButton();
    };
    GameButtons.addDefeatButtons = function() {
        GameButtons.addPlayAgainButton();
        GameButtons.addMainMenuButton();
    };

    GameButtons.addDefeatButtons = function() {

    };

    GameButtons.removeAllButtons = function removeAllButtons(activeButtons) {
        activeButtons = [];
    };

    GameButtons.addPeopleButton = function(activeButtons) {
        var indexerButton = {
            imgURL : "src/img/buttons/PeopleButton.png",
            xCoord : window.innerWidth/15 * 6,
            yCoord : 20,
            name : "indexerButton"
        };

        activeButtons.push(indexerButton);
    };

    GameButtons.addBuildingsButton = function(activeButtons) {
        var buildingButton = {
            imgURL : "src/img/buttons/BuildingsButton.png",
            xCoord : window.innerWidth/15 * 7,
            yCoord : 20,
            name : "buildingButton"
        };

        activeButtons.push(buildingButton);
    };

    GameButtons.addSpecialsButton = function(activeButtons) {
        var specialButton = {
            imgURL : "src/img/buttons/SpecialsButton.png",
            xCoord : window.innerWidth/15 * 8,
            yCoord : 20,
            name : "specialButton"
        };

        activeButtons.push(specialButton);
    };

    GameButtons.addPlacePeopleButtons = function(activePlaceButtons) {
        //activePlaceButtons = [];
        var indexerButton = {
            imgURL : "src/img/buttons/People/IndexerButton.png",
            xCoord : window.innerWidth/15 * 1,
            yCoord : 20,
            name : Sig.STAN_IDX
        };
        var specialistButton = {
            imgURL : "src/img/buttons/People/ResearchersButton.png",
            xCoord : window.innerWidth/15 * 2,
            yCoord : 20,
            name : Sig.RSCH_IDX
        };
        var investigatorButton = {
            imgURL : "src/img/buttons/People/SpecialistsButton.png",
            xCoord : window.innerWidth/15 * 3,
            yCoord : 20,
            name : ""
        };

        activePlaceButtons.push(indexerButton); activePlaceButtons.push(specialistButton); activePlaceButtons.push(investigatorButton);
        console.log("activePlaceButtons", activePlaceButtons);
    };

    GameButtons.addPlaceBuildingButtons = function(activePlaceButtons) {
          //activePlaceButtons = [];
          var buildingButton = {
              imgURL : "src/img/buildings/FHC.png",
              xCoord : window.innerWidth/15 * 1,
              yCoord : 20,
              name : Sig.STAN_BLD
          };

          activePlaceButtons.push(buildingButton);
    };

    GameButtons.addPlaceSpecialButtons = function(activePlaceButtons) {
          //activePlaceButtons = [];
          var storytellerButton = {
              imgURL : "src/img/buttons/Specials/StorytellerButton.png",
              xCoord : window.innerWidth/15 * 1,
              yCoord : 20,
              name : Sig.STRY_DRP
          };

          activePlaceButtons.push(storytellerButton);
    };

    GameButtons.addAll = function(activeButtons) {
        GameButtons.addPeopleButton(activeButtons);
        GameButtons.addBuildingsButton(activeButtons);
        GameButtons.addSpecialsButton(activeButtons);
    };

    return GameButtons;

});
