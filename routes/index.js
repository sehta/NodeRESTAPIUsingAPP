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
var util = require("util");
var fs = require("fs"); 
var parse = require('csv-parse');
var path = require('path');
var crypto = require("crypto");
var mime= require("mime");
var multer = require('multer');
var csv= require('fast-csv');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});


var upload = multer({ storage: storage });

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

    
    router.post('/fileupload', upload.array('myFile', 12), function(req,res){

       console.log('CALL')
         if (req.files.length) {
        
      file_name=req.files[0].filename;  
             console.log(req.files[0].path)
             
             
             var stream = fs.createReadStream(req.files[0].path);
 
                csv
                .fromStream(stream, {ignoreEmpty: true, headers: true})
                .on("data", function(data){
                    console.log('fast csv');
                    console.log(data['User Name']);
                })
                .on("end", function(){
                console.log("done");
                });
             
             
             
             // Parse CSS FILE START
             var csvData=[];
             fs.createReadStream(req.files[0].path)
                .pipe(parse({delimiter: ','}))
                .on('data', function(csvrow) {
                    console.log(csvrow);
                    //do something with csvrow
                    csvData.push(csvrow);        
                })
                .on('end',function() {
                    //do something wiht csvData
                  console.log('COMPLETE');
                    console.log(csvData);
                });
             // END PARSE
             
              console.log(file_name)
  res.render('fileupload', {'title':'Welcome to Node Web Application', message: req.flash('message'),  user: req.session.user});
         }
       else
        {
          return next(new Error("Hey, first would you select a file?"));
        }
    });
    

    router.get('/fileupload', isAuthenticated,function(req, res) {
       
  res.render('fileupload', {'title':'Welcome to Node Web Application', message: req.flash('message'),  user: req.session.user});
	});
    
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





