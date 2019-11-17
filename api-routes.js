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

                var skillMatch = 0;
                var interestMatch = 0;
                //match for skill
                for (var i = 0; i < resultPerson1.user.tagList.skillList.length; i++) {
                    for (var x = 0; x < resultPerson2.user.tagList.skillList.length; x++) {
                        if (resultPerson1.user.tagList.skillList[i] === resultPerson2.user.tagList.skillList[x]) {
                            skillMatch++
                        }
                    }
                }
                skillMatch = (100 / resultPerson1.user.tagList.skillList.length) * skillMatch;


                //match interest
                for (var i = 0; i < resultPerson1.user.tagList.interestList.length; i++) {
                    for (var x = 0; x < resultPerson2.user.tagList.interestList.length; x++) {
                        if (resultPerson1.user.tagList.interestList[i] === resultPerson2.user.tagList.interestList[x]) {
                            interestMatch++
                        }
                    }
                }
                interestMatch = (100 / resultPerson1.user.tagList.interestList.length) * interestMatch;


                res.json({
                    "skillMatch": skillMatch.toString(),
                    "interestMatch": interestMatch.toString()

                });
                client.close();
            })

        })
    });

});

router.post('/addTagsToUser/:user', function (req, res) {
    var myobj = req.body;
    let objID = new ObjectId(req.params.user);

    const filter = "user.tagList." + req.body.type.toString();
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("user").updateOne({_id: objID}, {$push: {[filter]: myobj.name}});
        client.close();
        res.send("joar")
    });
})
//WIP
router.post('/addRequirementsToJob/:job', function (req, res) {
    var myobj = req.body;
    let objID = new ObjectId(req.params.job);

    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("user").updateOne({_id: objID}, {$push: {"user.jobList": myobj.name}});
        client.close();
        res.send("joar")
    });
})
router.post('/addJobs', function (req, res) {

    res.send('job has been added');
})


router.post('/addUser', function (req, res) {

    res.send('user has been added');
    let name = req.body,name;
    let avatar = req.body.avatar;
    let myObj = {
        name : name;
        avatar : avatar;
    }
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        client.db(DATABASE_NAME).collection("user").insertOne(myobj, function (err, response) {
            if (err) throw err;
            console.log("1 document inserted");
            res.json({status: "user created"});
            // db.close();
        });
    });
})

router.get('/getAvatar', function (req, res){
    let avatarArray = [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4r0IbiG4zVd4vQK7_C_DX5H7fP7i20E6d5sKUla6WZqaW0auPmQ&s",
        "data:image/jpeg;base64,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",
        "data:image/png;base64,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",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTynSetkTudpJGPUFVGN6yT5jNS7D8JLD2bOBj6HqiYKlJ6QhKR&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNzORdPdq1NvvbiyQu98qUFhNiPmh-_Gl4pvwL2G7FufBNHKJu&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWc1VRSkyMhnPAS7mow9JFIoJxfeSyQPcWxDqEzCZpuZgNcHLz&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiqokejonbQypExrmubnkHbNe6PF1e6jui-qQbYJMVTvlSorF5&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeqc3ZH6qpVv9dG2m7rzYp8E5cZYAsjh9YcfN_QELaXSvjbQjO&s"
    ];
    res.send(avatarArray);
});

router.post('/addTagsToConference/:conference', function (req, res) {
    var myobj = req.body;
    let objID = new ObjectId(req.params.conference);

    const filter = "user.tagList." + req.body.type.toString();
    //maybe test for user.taglist exists + so on
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("conference").updateOne({_id: objID}, {$push: {[filter]: myobj.name}});
        client.close();
        res.send("joar")
    });
})
// Export API routes
module.exports = router