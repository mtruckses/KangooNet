// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Import Mongo
const MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL = "mongodb+srv://Herta:PKC5ZLoLNcg2zEez@kangoonet-entqn.gcp.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "KangooNet";
var db;
//connect mongoDB


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
    MongoClient.connect(CONNECTION_URL, function (err, client) {
        db = client.db(DATABASE_NAME).collection("conference").find({}, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send("jo!");
            client.close();
        })
    });
});
// Export API routes
module.exports = router;