var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();
var db = require('../model/db');
var acl = require('acl');
acl = new acl(new acl.memoryBackend());
// guest is allowed to view blogs

// NEED to do it Dynamic
acl.allow('guest', 'blogs', 'view')
acl.allow('guest', 'faq', 'view')

// GET USER ROLE Dynamicaaly and add here
acl.addUserRoles('dal', 'guest')

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

var userIsAuthenticated = function (req, res) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return true;
	// if the user is not authenticated then redirect him to the login page
	return false;
}


var async_function = function(resource, action, uid, callback){
     acl.isAllowed(uid, resource, action, function(err, res){
        if(res){
            callback(true);
        }
        else
            callback(false);
});
};








module.exports = function(passport){

    
    router.get('/blogs', isAuthenticated,function(req, res) {
       async_function('blogs', 'view', 'dal', function(val) {
        if(val==false){
            res.redirect('/accessdenied');
        }
        else {
            console.log("Success-----have permission");
            res.render('blogs', {'title':'Welcome to Node Web Application', message: req.flash('message'),user: req.session.user});
        }
});
        

    //    acl.allowedPermissions('dal', ['blogs'], function(err, permissions){
    //    console.log(permissions)
    //    });
	});
    
        router.get('/about', isAuthenticated,function(req, res) {
       async_function('about', 'view', 'dal', function(val) {
        if(val==false){
            res.redirect('/accessdenied');
        }
        else {
            console.log("Success-----have permission");
            res.render('about', {'title':'Welcome to Node Web Application', message: req.flash('message'),  user: req.session.user});
        }
});

	});
    
     router.get('/contact', isAuthenticated,function(req, res) {
       async_function('contact', 'view', 'dal', function(val) {
        if(val==false){
            res.redirect('/accessdenied');
        }
        else {
            console.log("Success-----have permission");
            res.render('contact', {'title':'Welcome to Node Web Application', message: req.flash('message'),  user: req.session.user});
        }
});

	});
    router.get('/faq', isAuthenticated,function(req, res) {
       async_function('faq', 'view', 'dal', function(val) {
        if(val==false){
            res.redirect('/accessdenied');
        }
        else {
            console.log("Success-----have permission");
            res.render('faq', {'title':'Welcome to Node Web Application', message: req.flash('message'),  user: req.session.user});
        }
});

	});
    
    
      router.get('/accessdenied', isAuthenticated,function(req, res) {
       
  res.render('accessdenied', {'title':'Welcome to Node Web Application', message: req.flash('message'),  user: req.session.user});
	});
    
	/* GET login page. */
	router.get('/', function(req, res) {
       	// Display the Login page with any flash message, if any
      
		if(!userIsAuthenticated){
        res.render('index', {'title':'Welcome to Node Web Application', message: req.flash('message') });
        }
        else
             res.redirect('/home');
        // res.render('login', { title:'Login Page',message: req.flash('message')});
	});

    router.get('/index', function(req, res) {
       	// Display the Login page with any flash message, if any
         console.log(' index isAuthenticated')
        
    if(!userIsAuthenticated){
        res.render('index', 
                {'title':'Welcome to Node Web Application', 
                    message: req.flash('message')
                });
        }
        else
             res.redirect('/home');
        // res.render('login', { title:'Login Page',message: req.flash('message')});
	});

    /* GET login page. */
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
    var title="Login Page";
       if(!userIsAuthenticated(req,res)){
               res.render('login', { title:title,message: req.flash('message')});
           }
        else
            res.render('login', { title:title,message: 'Already Loggedin',  user: req.session.user});
	});
    
	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
        
		successRedirect: '/home',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
        if(!userIsAuthenticated(req,res))
		  res.render('signup',{title:"SignUp Page",message: req.flash('message')});
        else
            res.render('signup',{title:"SignUp Page",message: 'Already Loggedin', user: req.session.user});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
        req.session.user=req.user;
          client.get("http://localhost:4000/api/users", function (data, response) {
           res.render('home', { user: req.session.user, title:'Home Page', users:data.users });
          });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
        delete req.session ;
		req.logout();
		res.redirect('/');
	});

	return router;
}





