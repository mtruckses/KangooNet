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

            res.json(result);

            client.close();
        });
    });
});
//Get user by Id
router.get('/user/:userId', function (req, res) {
    const id = req.params.userId;
    var objID = new ObjectId(id);
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        if (err) {
            res.send(409);
        }
        db = client.db(DATABASE_NAME).collection("user").findOne({_id: objID}, function (err, result) {
            if (err) throw err;

            res.json(result);

            client.close();
        });
    });
});
//get user by name
router.get('/login/:name', function (req, res) {

    const name = req.params.userId;

    MongoClient.connect(CONNECTION_URL, function (err, client) {

        if (err) {
            res.send(409);
        }

        db = client.db(DATABASE_NAME).collection("user").findOne({name: name}, function (err, result) {

            if (err) {
                res.send(409);
            }

            res.json(result);
            client.close();
        });
    });
});
//get avatar urls
router.get('/avatar', function (req, res) {

    res.json({
        "avatar": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu7uFs9ddlwqTITqH1OaMpntNBMndOD5ipFRZqHlpImd1jR--t&s",
            "https://i.pinimg.com/564x/78/54/84/7854843699c1893928012a442386a129.jpg",
            "https://i.pinimg.com/564x/6e/f9/54/6ef95483656d96448c2c83fc65c645f5.jpg",
            "http://i.imgur.com/187Y4u3.png"]
    })
});
//post user to db
router.get('/create', function (req, res) {

    var exists = false;

    MongoClient.connect(CONNECTION_URL, function (err, client) {

        if (err) {
            res.send(409);
        }

        db = client.db(DATABASE_NAME).collection("user").findOne({name: req.body.name.toString()}, function (err, result) {
            if (err) {
                res.send(409);
            }

            if (result != null) {
                exists = true;
                res.send(409, {"result": false})
            }
        });

        if (!exists) {

            db = client.db(DATABASE_NAME).collection("user").insertOne(
                {
                    "user": {
                        "role": req.body.role.toString(),
                        "name": req.body.name.toString(),
                        "avatar": req.body.avatar.toString(),
                        "linkList": [
                            {
                                "name": "LinkedIn",
                                "url": "https://www.linkedin.com/company/heykangaroo/"
                            }
                        ],
                        "jobList": [],
                        "tagList": {
                            "skillList": [],
                            "interestList": [],
                            "locationList": []
                        },
                        "contactList": [],
                        "attendance": {
                            "conference": {
                                "id": "5dd011114ca4823874e9fefa",
                                "name": "CodeCamp HN",
                                "logo": "https://www.codecamp-heilbronn.de/wp-content/uploads/2018/09/CC_Heilbronn_MainLogo_110x40.png",
                                "tagList": {
                                    "location": "Heilbronn",
                                    "skillList": [
                                        "Google Cloud",
                                        "MongoDB",
                                        "JS"
                                    ]
                                },
                                "expirationDate": "18.11.2019"
                            }
                        },
                        "upcomingConferenceList": [],
                        "conferenceHistory": []
                    }
                })
        }
    });
});
//add user to contacts
router.get('/user/add/:idToAdd/asFirendTo/:userId', function (req, res) {

    var objID = new ObjectId(req.params.userId);
    var objID2 = new ObjectId(req.params.idToAdd);

    MongoClient.connect(CONNECTION_URL, function (err, client) {
        if (err) {
            res.send(409);
        }

        db = client.db(DATABASE_NAME).collection("user").updateOne({_id: objID}, {$push: {"user.contactList": objID2}});
        client.close();
        res.send(objID2 + " added to " + objID)

    });
});
//get all conferences
router.get('/conference', function (req, res) {

    MongoClient.connect(CONNECTION_URL, function (err, client) {
        if (err) {
            res.send(409);
        }
        client.db(DATABASE_NAME).collection("conference").find({}).toArray(function (err, result) {
            if (err) {
                res.send(409);
            }
            res.send(result);
            client.close();
        })


    });
});
//get one conference with ID
router.get('/conference/:id', function (req, res) {

    const id = parseInt(req.params.id, 10); // nur req.params.id
//    var objID = new ObjectId("5dd011114ca4823874e9fefa")
    var objID = new ObjectId(id);
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        if (err) {
            res.send(409);
        }
        client.db(DATABASE_NAME).collection("conference").findOne({_id: objID}, function (err, result) {
            if (err) {
                res.send(409);
            }
            res.send(result);
            client.close();
        })
    });
});
//post Conference to db
router.post('/createConference', function (req, res) {

    var myobj = req.body;

    MongoClient.connect(CONNECTION_URL, function (err, client) {

        client.db(DATABASE_NAME).collection("conference").insertOne(myobj, function (err, response) {

            if (err) throw err;
            res.json({status: "jo geht!"});
            // db.close();
        });
    });
});
//get matching % for job id1 dominant (companyID)
router.get('/matchJobs/:id1/:id2', function (req, res) {

    let person1 = req.params.id1;
    let person2 = req.params.id2;
    person1 = new ObjectId(person1);
    person2 = new ObjectId(person2);

    MongoClient.connect(CONNECTION_URL, function (err, client) {
        if (err) {
            res.send(409);
        }

        client.db(DATABASE_NAME).collection("user").findOne({_id: person1}, function (err, resultPerson1) {
            if (err) {
                res.send(409);
            }
            client.db(DATABASE_NAME).collection("user").findOne({_id: person2}, function (err, resultPerson2) {
                if (err) {
                    res.send(409);
                }

                var returnJson = [{}];
                var match;

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
        if (err) {
            res.send(409);
        }
        
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
                for (var i = 0; i < resultPerson1.user.tagList.skillList.length; i++) {
                    for (var x = 0; x < resultPerson2.user.tagList.skillList.length; x++) {
                        if (resultPerson1.user.tagList.skillList[i] === resultPerson2.user.tagList.skillList[x]) {
                            skillMatch[skillMatch.length] = resultPerson1.user.tagList.skillList[i];
                        }
                    }
                }

                //match interest
                for (var i = 0; i < resultPerson1.user.tagList.interestList.length; i++) {
                    for (var x = 0; x < resultPerson2.user.tagList.interestList.length; x++) {
                        if (resultPerson1.user.tagList.interestList[i] === resultPerson2.user.tagList.interestList[x]) {
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
// Export API routes
module.exports = router;