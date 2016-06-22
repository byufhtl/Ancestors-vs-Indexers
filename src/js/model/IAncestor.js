define([],function() {

    function IAncestor(lane) {
      this.hp = 2;
      this.speed = 30;
      this.lane = lane;
      this.animation;
      this.xCoord = 1000;
      this.yCoord = 300;
    }

    console.log("IAncestor readout:", new IAncestor(0));

    IAncestor.prototype = {
        hp: this.hp,
        speed: this.speed,
        lane: this.lane,
        animation: this.animation,
        xCoord: this.xCoord,
        yCoord: this.yCoord
    };

    console.log("IAncestor readout 2:", new IAncestor(0));

    return IAncestor;

});
