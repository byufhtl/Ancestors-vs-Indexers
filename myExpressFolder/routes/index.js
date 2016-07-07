
(function() {
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
        res.sendFile('index.html', {root: public});
    });

    /*
     Yeah, I have no idea what I'm doing here...
     */
    router.get('/profiles', function (req, res) {
        Person.find({pid: req.pid}, function (err, docs) {
            if (docs) {
                res.statusCode(200).json(docs[0]);
            }
        });
    });

    var myguy = new Person({pid: "stuff", data: {a: 'a', b: 'b'}});

    myguy.save();

    db.once('open', function () {
        console.log("DB OPEN");
    });

    module.exports = router;

});