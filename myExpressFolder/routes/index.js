var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


mongoose.connect("mongodb://localhost/persons");

// Set up the db connection
var db = mongoose.connection;

var personSchema = mongoose.Schema({
  pid: String,
  data: Object
});

var Person = mongoose.model('Person', personSchema); // Make template object.

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html', {root:public});
});

router.post('/profiles', function(req, res){
  res.statusCode(200);
});

var myguy = new Person({pid: "stuff", data: {a:'a', b:'b'}});

myguy.save();

db.once('open', function(){
    console.log("DB OPEN");
});

module.exports = router;
