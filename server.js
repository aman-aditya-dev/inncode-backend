const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});
app.use(passport.initialize());
app.use(passport.session());
// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Hi, ready to rolls"});
});

// listen for requests
//  require('./app/routes/note.routes.js')(app);
//  require('./app/routes/contactus.routes.js')(app);
require('./app/routes/iot.routes.js')(app);
 require('./app/routes/user.routes.js')(app);
//  require('./app/routes/category.routes.js')(app);
//  require('./app/routes/product.routes.js')(app);
//app.use('/create', require('./app/routes/user.routes.js'));

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
