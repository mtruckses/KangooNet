// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
let ObjectId = require('mongodb').ObjectId;

// Import Mongo
const MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL = "mongodb+srv://Herta:PKC5ZLoLNcg2zEez@kangoonet-entqn.gcp.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "KangooNet";
var db;

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to KangooNets world of APIs'
    });
});

router.get('/user', function (req, res) {
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("user").find({}).toArray((error, result) => {
            if (error) throw error;

            console.log(result);
            res.json(result);

            client.close();
        });
    });
});

router.get('/user/:userId', function (req, res) {
    const id = req.params.userId;
    console.log(id);
    var objID = new ObjectId(id);
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("user").findOne({_id: objID}, function (err, result) {
            if (err) throw err;

            console.log(result);
            res.json(result);

            client.close();
        });
    });
});

router.get('/user/add/:idToAdd/asFirendTo/:userId', function (req, res) {
    var objID = new ObjectId(req.params.userId);
    var objID2 = new ObjectId(req.params.idToAdd);
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("user").updateOne({_id: objID}, {$push: {"user.contactList": objID2}});
        client.close();
        res.send(objID2 + " added to " + objID)
    });
});
//get all conferences
router.get('/conference', function (req, res) {

    MongoClient.connect(CONNECTION_URL, function (err, client) {
        result = client.db(DATABASE_NAME).collection("conference").find({}).toArray(function (err, result) {
            console.log(result);
            res.send(result);
            client.close();
        })


    });
});
//get one conference with ID
router.get('/conference/:id', function (req, res) {

    const id = req.params.id;
    var objID = new ObjectId(id);
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        client.db(DATABASE_NAME).collection("conference").findOne({_id: objID}, function (err, result) {
            console.log(result);
            res.send(result);
            client.close();
        })
    });
});

router.post('/createConference', function (req, res) {
    var myobj = req.body;

    MongoClient.connect(CONNECTION_URL, function (err, client) {
        client.db(DATABASE_NAME).collection("conference").insertOne(myobj, function (err, response) {
            if (err) throw err;
            console.log("1 document inserted");
            res.json({status: "jo geht!"});
            // db.close();
        });
    });


});

router.get('/matchJobs/:id1/:id2', function (req, res) {

    let person1 = req.params.id1;
    let person2 = req.params.id2;
    person1 = new ObjectId(person1);
    person2 = new ObjectId(person2);

    MongoClient.connect(CONNECTION_URL, function (err, client) {

        client.db(DATABASE_NAME).collection("user").findOne({_id: person1}, function (err, resultPerson1) {
            client.db(DATABASE_NAME).collection("user").findOne({_id: person2}, function (err, resultPerson2) {
                var returnJson = [{}];
                var match;
                console.log(resultPerson1.user.jobList.length);
                for (var y = 0; y < resultPerson1.user.jobList.length; y++) {
                    match = 0;
                    //match for Skill
                    for (var i = 0; i < resultPerson1.user.jobList[y].requirementsTags.length; i++) {
                        for (var x = 0; x < resultPerson2.user.tagList.skillList.length; x++) {
                            if (resultPerson1.user.jobList[y].requirementsTags[i] === resultPerson2.user.tagList.skillList[x]) {
                                match++;
                                break;
                            }
                        }
                    }
                    match = (100 / resultPerson1.user.tagList.skillList.length) * match;
                    console.log({"jobName": resultPerson1.user.jobList[y].name.toString(), "match": match.toString()});
                    returnJson[y] = {
                        "jobName": resultPerson1.user.jobList[y].name.toString(),
                        "match": match.toString()
                    }
                }

                res.json(returnJson);
                client.close();
            })

        })
    });

});

router.get('/addJob/:idToAdd', function (req, res) {
    var objID = new ObjectId(req.params.userId);
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("user").updateOne({_id: objID}, {$push: {"user.jobList": req.body}});
        client.close();
        res.send(req.body);
    });
});

//first is dominant
router.get('/match/:id1/:id2', function (req, res) {

    let person1 = req.params.id1;
    let person2 = req.params.id2;
    person1 = new ObjectId(person1);
    person2 = new ObjectId(person2);

    MongoClient.connect(CONNECTION_URL, function (err, client) {

        client.db(DATABASE_NAME).collection("user").findOne({_id: person1}, function (err, resultPerson1) {
            client.db(DATABASE_NAME).collection("user").findOne({_id: person2}, function (err, resultPerson2) {

                var skillMatch = [];
                var interestMatch = [];
                //match for skill

                for(var i = 0; i < resultPerson1.user.tagList.skillList.length; i++ )
                {
                    for(var x = 0; x < resultPerson2.user.tagList.skillList.length; x++){
                        if (resultPerson1.user.tagList.skillList[i] === resultPerson2.user.tagList.skillList[x]){
                            skillMatch[skillMatch.length] = resultPerson1.user.tagList.skillList[i];
                        }
                    }
                }


                //match interest
                for(var i = 0; i < resultPerson1.user.tagList.interestList.length; i++ )
                {
                    for(var x = 0; x < resultPerson2.user.tagList.interestList.length; x++){
                        if (resultPerson1.user.tagList.interestList[i] === resultPerson2.user.tagList.interestList[x]){
                            interestMatch[interestMatch.length] = resultPerson1.user.tagList.interestList[i];
                        }
                    }
                }


                res.json({
                    skillMatch,
                    interestMatch
                });
                client.close();
            })

        })
    });

});

router.post('/addTagsToUser/:user', function (req, res) {
    var myobj = req.body;
    let objID = new ObjectId(req.params.user);

    const filter = "user.tagList."+req.body.type.toString();
    console.log(filter);
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("user").updateOne({_id: objID}, {$push: { [filter] : myobj.name}});
        client.close();
        res.send("joar")
    });
})
// Export API routes

module.exports = router;

