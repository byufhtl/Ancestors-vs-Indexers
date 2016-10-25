

    var express = require('express');
    var router = express.Router();
    var mongoose = require('mongoose');

    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost:27017/user");

    // Set up the db connection
    var db = mongoose.connection;

    var personSchema = mongoose.Schema({
        _id: String,
        data: Object
    });

    var user = mongoose.model('user', personSchema); // Make template object.



    //var myUser2 = new user({_id: "bilbo", data: {age: '100', height: '6'}});
    //myUser2.save();


/////////////////////////////////////



    router.get('/', function (req, res) {
        console.log("serving index.html");
        res.sendfile('index.html', {root: public});
    });


    router.post('/replace', function(req, res){
        console.log('replacing users data with new');
        user.remove({_id:req.body._id}, function(err){
          if (err) console.log("Couldn't remove, invalid __next_id");
            tempUser = new user(req.body);
            tempUser.save();
        });
    });

    /*
     Yeah, I have no idea what I'm doing here...
     */
    router.get('/profile', function (req, res) {
        console.log("trying to find the user at", req.query.__next_id);

        user.find({_id: req.query.__next_id}, function (err, docs) {
            if (docs) {
                console.log("we found the user ", docs[0]);
                if (docs[0] != undefined){
                    res.send(docs[0]);
                }
                else{
                    console.log("creating a new entry in the database");
                    var tempData = {_id:req.query.__next_id,data:{furthestAct:1,furthestScene:1,lastUpdate:Date.now()}};
                    console.log("temp data is:", tempData);
                    var tempUser = new user(tempData);
                    console.log("temp user is:", tempUser);
                    tempUser.save();
                    res.send(tempData);
                }
            }
        });
    });


    router.post('/setPerson', function(req,res,next){
        console.log("posting a person: ", req.body);
        var tempUser = new user(req.body);
        tempPerson.save();
    });

    module.exports = router;
