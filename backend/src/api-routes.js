// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Import Mongo
const  MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL ="mongodb+srv://Herta:PKC5ZLoLNcg2zEez@kangoonet-entqn.gcp.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "KangooNet";
var db;
//connect mongoDB
MongoClient.connect(CONNECTION_URL, function(err, client) {
    console.log("Connected successfully to server");
     db = client.db(DATABASE_NAME);
    client.close();
});

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

router.get('/conference', function (req, res) {

    db.collection("conference").find({}, function (err, result) {
        if(err) throw err;
        res.send(result);
    })
});
// Export API routes
module.exports = router;