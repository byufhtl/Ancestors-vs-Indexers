/**
 * Created by calvinmcm on 7/6/16.
 */

define(['../../../structure/src/js/LevelDefinition'],function(LevelDef){

    function UserProfile(userPID, basePoints){
        this.pid = userPID;
        this.history = UserProfile.generateHistory(); // starts fully planned out.
        this.assets = UserProfile.generateAssetTracker(); // build as you go.
        this.points = (basePoints) ? basePoints : 0; //An easy tracking mechanism for real-world work. Saves last login's data.
    }

    UserProfile.prototype.setRoundResult = function(act, scene, time){
        history[act][scene].time = time;
    };

    /**
     * This is a really bad way to do this, but for now...
     * @param assetGroup
     * @param assetType
     * @param asset
     */
    UserProfile.prototype.updateAsset = function(assetGroup, assetType, asset){
        if(this.assets.hasOwnProperty(assetType)){
            this.assets[assetType][assetName] = asset;
        }
        return 0;
    };

    UserProfile.generateHistory = function(){
        var levels = LevelDef.levels;
        var history = {};
        for(var act in levels){
            if(levels.hasOwnProperty(act)){
                history[act] = {};
                for(var scene in levels[act]){
                    if(levels[act].hasOwnProperty(scene)) {
                        history[act][scene] = {time: null};
                    }
                }
            }
        }
        return history;
    };

    UserProfile.generateAssetTracker = function(){
        return ({
            buildings: {
                recordMaker: {
                    type: "familyHistoryCenter"
                },
                barrier: {
                    type: "woodWall" // "stoneWall" "ironWall" "recordWall"
                }
            },
            indexers: {
                sprinkler:{ // Round robin shooter
                    type: "novice" // "hobbyist" "aficionado" "guru" "fanatic"
                },
                runner: { // Runs into ancestors to defeat them.
                    type: "beginner" // "amateur" "specialist" "researcher" "genealogist"
                }/*,
                spammer: { // shoots in all directions simultaneously with a slower fire rate.
                    type: "batcher" // "big-bang" "burst indexer" "The Wave"
                },
                geek: { // records progress along a random path until they hit an ancestor. Projectiles never expire.
                    type: "n00b" // "layman" "programmer" "hacker" "dev"
                }*/
            }
        });
    }


});