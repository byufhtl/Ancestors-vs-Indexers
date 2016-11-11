/**
 * Created by calvinm2 on 10/25/16.
 */
/**
 * Created by calvin on 7/8/16.
 */
define([],function(){
    class Signal{
        constructor(type, value, data) {
            this.type = type; // string
            this.value = value; // string
            this.data = data ? data : null; // {}

            this.DO_LOGIN =     "doLogin";
            this.FSREQUEST =    "fsreq";
        }
        matches(type) {
            return (this.type === type);
        };
    }
    return Signal;
});