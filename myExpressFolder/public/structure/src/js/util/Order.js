/**
 * Created by calvin on 7/11/16.
 */

define([],function(){

    function Order(){
        this.batch = [];
    }

    Order.prototype.addItem = function(url, type, tries){
        tries = tries ? tries : 15;
        this.batch.push({url: url, type: type, tries:tries});
    };

    Order.prototype.getBatches = function(){
        return this.batch;
    };
    
    Order.HTML = "html";
    Order.IMAGE = "img";

    return Order;
});