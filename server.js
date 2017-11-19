/** 
 * @file server.js
 * @desc Point d'entrée de l'application 'CookPizzaDelelicious'.<br />
 * L'application CookPizzaDelelicious permet de gérer une liste de pizza. <br />
 * 
 * Date de création 20/10/2017 <br />
 * Date de mofication 20/10/2017 <br />
 * 
 * @version Alpha 1.0.0
 * 
 * @author Laurent Martinez <laurent.martinez@ynov.com>
 * 
 */
'use strict';
// REQUIRE
const path          = require('path');
const express       = require('express');
const app           = express();
const http          = require('http').Server(app);
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser'); // for post 
const config        = require('config'); // load db location to split test and dev database
const morgan        = require('morgan');
const port          = (config.util.getEnv('NODE_ENV') === 'development')?8080:8081 

// Require Controller
const Pizza         = require ('./Controller/pizzaController');
const Ingredient    = require ('./Controller/ingredientController');


//db options 
let options = { 
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 
              
// Mongoose
mongoose.connect(config.DBHost, options)
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //using morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

// General conf
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

//socket
app.use(express.static(path.join(__dirname, 'View')));
app.use(express.static(path.join(__dirname, 'node_modules', 'socket.io-client', 'dist')));

// Conf Routes
app.use('/pizza', Pizza);
app.use('/ingredient', Ingredient);

app.listen(port, () => {
    console.log(`Starting web server at ${port}`)
});

module.exports = app; // For testing