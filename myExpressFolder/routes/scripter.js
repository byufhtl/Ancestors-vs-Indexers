/**
 * Created by calvinm2 on 10/19/16.
 */


var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log("serving scripter index.html");
    res.sendfile('index.html', {root: "scripter"});
});

module.exports = router;
