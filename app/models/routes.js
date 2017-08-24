

module.exports= function(app, passport){
	//home page with login links
	app.get('/', function(req, res){
      res.render('index.ejs');
	});

	// login
	app.get('/login', function(req, res){
      
      //render the page & pass in any flash data if it exists
      res.render('login.ejs', { message: req.flash('loginMessage')});
      
 	});

	//signup
	app.get('/signup', function(req, res){
      
      //render the page and pass flash data if it exists
      res.render('signup.ejs', {message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
    	//console.log('this is post');

        successRedirect : '/profile', // redirect to secure profile section
        failureRedirect : '/signup', //redirect back to signup page if there is an error
        failureFlash : true// allow flash messages

	}));


   	//profile section
    app.get('/profile', isLoggedIn, function(req, res){
    	console.log('req is made');
    	res.render('profile.ejs', {user: req.user});
    	console.log('profile response'); // get the user out of session and pass to template
    });

    //logout
    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    }) ;
};


//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next){

	//if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	//if they aren't redirect to home page
	res.redirect('/');
}