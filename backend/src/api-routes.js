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
    res.json({
        status: 'API Its Working',
        message: 'Welcome to KangooNets world of APIs'
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

    const id = parseInt(req.params.id, 10);
//    var objID = new ObjectId("5dd011114ca4823874e9fefa")
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
            res.json({status : "jo geht!"});
           // db.close();
        });
    });


});
// Export API routes
module.exports = router;