/**
 * Created by calvinm2 on 9/14/16.
 */

define([],function(){

    function CoordUtils(){}

    /**
     * Determines if two points are close together.
     * @param x1 The x coordinate of the first point.
     * @param y1 The y coordinate of the first point.
     * @param x2 The x coordinate of the second point.
     * @param y2 The y coordinate of the second point.
     * @param dx The maximum distance between x values to qualify (inclusive)
     * @param dy The maximum distance between y values to qualify (Set to dx by default for radial checking) (inclusive).
     * @returns {boolean}
     */
    CoordUtils.proximate = function(x1, y1, x2, y2, dx, dy = dx){
        return((Math.abs(x1 - x2) <= dx) && (Math.abs(y1 - y2) <= dy));
    };


    return CoordUtils;
});