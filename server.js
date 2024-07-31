// server.js
const express = require('express');
const dotenv = require('dotenv') ;
dotenv.config();
const path = require('path')
const bodyParser = require('body-parser');
const mongooseconfig = require('./config/mongoose');
const csvRouter = require('./src/routes/routes');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

//path of static files
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'assets')));

//set view engine for ejs
app.set('view engine', 'ejs');

//set ejs file path
app.set("views", "./src/views");




// Routes
app.use('/', csvRouter)



// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
  mongooseconfig.connectUsingMongoose();
});
