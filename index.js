// FileName: index.js
// Import express
const express = require('express');
// Inpmort body-parser
const BodyParser = require("body-parser");
// Import Swagger
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require('./swagger.json');

// Initialize the app
var cors = require('cors')
const app = express();
app.use(cors())




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