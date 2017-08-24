
var LocalStrategy = require('passport-local').Strategy;
var passport= require('passport');


var User = require('../app/models/user.js');

//expose this function to our app using module.exports
module.exports= function(passport){

//passport session setup
//used to serialize the session
passport.serializeUser(function(user, done){
  done(null, user.id);
});

//used to deserialize the user
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

//local signup
passport.use('local-signup', new LocalStrategy({
  //by default local strategy uses username nd password
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {
	//asynchronous
	//user.findOne wont fire unless data is sent back
	process.nextTick(function(){

		//find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
    User.findOne({'local.email': email}, function(err, user){

    	//if any errors return error
        if(err)
        	return done(err);

        //check to see if theres already a user with that email
        if(user){
        	return done(null, false, req.flash('signupMessage','This email is already taken' ));
        } else {

        	//if there is no user with that email
        	//create the user
        	var newUser= new User();

        	//set the user's local credentials
        	newUser.local.email= email;
        	newUser.local.password= newUser.generateHash(password);

        	//save the user
        	newUser. save(function(err){
              if (err)
              	throw err;
              return done(null, newUser);
        	});
        }
    });
	});
}

));

};



/*// local login

passport.use('local-login', new LocalStrategy({
  
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true 
},

function(req, email, password, done){ // call back with email and passsword from the form

  User.findOne({'local.email': email}, function(err, user){

  	//if any error return the error before anything else
  	if (err)
  		return done(err);

  	//if no user is found return the message
    if (!user)
    	return done(null, false, req.flash('loginMessage', 'No user found' ));

    //if the user is found but the password is wrong

    if (!user.validPassword(password))
    	return done(null, false, req.flash('loginMessage', 'Oops! wrong password.'));

    // if everything ok
    return done(null, user);
  });
}
  
));*/