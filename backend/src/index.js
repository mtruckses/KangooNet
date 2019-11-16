// FileName: index.js
// Import express
const express = require('express');
// Inpmort body-parser
const BodyParser = require("body-parser");
// Import Swagger
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require('./swagger.json');
// Import Mongo
const  MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL ="mongodb+srv://Herta:PKC5ZLoLNcg2zEez@kangoonet-entqn.gcp.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "KangooNet";
// Initialize the app
const app = express();

//connect mongoDB
MongoClient.connect(CONNECTION_URL, function(err, client) {
    console.log("Connected successfully to server");
    const db = client.db(DATABASE_NAME);
    client.close();
});


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ exended: true }));
// Setup server port
var port = process.env.PORT || 8080;
// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});
// Import routes
let apiRoutes = require("./api-routes");
// Use Api routes in the App
app.use('/api', apiRoutes);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));