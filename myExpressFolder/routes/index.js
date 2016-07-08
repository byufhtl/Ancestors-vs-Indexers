

    var express = require('express');
    var router = express.Router();
    var mongoose = require('mongoose');


    mongoose.connect("mongodb://localhost:27017/persons");

    // Set up the db connection
    var db = mongoose.connection;

    var personSchema = mongoose.Schema({
        pid: String,
        data: Object
    });

    var Person = mongoose.model('Person', personSchema); // Make template object.

    /* GET home page. */


    router.get('/', function (req, res) {
        console.log("serving index.html");
        res.sendfile('index.html', {root: public});
    });


    /*
     Yeah, I have no idea what I'm doing here...
     */
    router.get('/profile', function (req, res) {
        Person.find({pid: req.pid}, function (err, docs) {
            if (docs) {
                res.statusCode(200).json(docs[0]);
            }
        });
    });


    router.post('/setPerson', function(req,res,next){
        console.log("posting a person: ", req.body);
        var tempPerson = new Person(req.body);
        tempPerson.save();
    });

    module.exports = router;
