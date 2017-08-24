var express= require('express');
var app= express();
var mongoose= require('mongoose');
//var MongoClient= require('mongodb').MongoClient
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash= require('connect-flash');
var morgan= require('morgan');
var cookieParser= require('cookie-parser');
var bodyParser= require('body-parser');
var session= require('express-session');
var configDB= require('./config/database.js');

//db configuration
mongoose.connect(configDB.url, {'useMongoClient': true});

require('./config/passport.js')(passport); // pass passport for configuration


app.use(morgan('dev'));  
app.use(cookieParser()); // read cookies
app.use(bodyParser.urlencoded({'extended': 'true'})); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

//require for passport
//app.use(session({secret: 'ilovenodejs'}));
app.use(session({
    secret: 'ilovenodejs',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

// routes
require('./app/models/routes.js')(app, passport);

app.listen(3000, function(){
  console.log('server port is running on 3000');
});