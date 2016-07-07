var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html', {root:public});
});

mongoose.connect("mongodb://localhost/persons");

var personSchema = mongoose.Schema({
    pid: String,
    data: Object
});

var Person = mongoose.model('Person', personSchema); // Make template object.

var db = mongoose.connection;

var myguy = new Person({pid: "stuff", data: {a:'a', b:'b'}});

myguy.save();

db.once('open', function(){
    console.log("DB OPEN");
});


router.post('/setPerson', function(req,res,next){
    console.log("posting a person: ", req.body);
    var tempPerson = new Person(req.body);
    tempPerson.save();
});

module.exports = router;
