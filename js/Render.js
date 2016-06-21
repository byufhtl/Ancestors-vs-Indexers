define([],function() {


    var Render()
    {

    }

    Render.prototype.renderBackground = function()
    {
      if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height, 0, 0, canvas.width, canvas.height);
      }
    };

    Render.prototype.renderAncestors = function(activeAncestors)
    {

    };

    Render.prototype.renderIndexers = function(activeIndexers)
    {

    };

    Render.prototype.renderBuildings = function(activeBuildings)
    {

    };

    Update.prototype.render = function(activeAncestors, activeIndexers, activeBuildings)
    {
      this.renderBackground();
      this.renderAncestors(activeAncestors);
      this.renderIndexers(activeIndexers);
      this.renderBuildings(activeBuildings);
    };


    return Update;

});
