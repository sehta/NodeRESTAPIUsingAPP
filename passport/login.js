var LocalStrategy   = require('passport-local').Strategy;
var User = require('../model/user');
var bCrypt = require('bcrypt-nodejs');
var Client = require('node-rest-client').Client;
 
var client = new Client();

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
//            User.findOne({ 'email' :  username }, 
//                function(err, user) {
//                    // In case of any error, return using the done method
//                    if (err)
//                        return done(err, {'title':'test'});
//                    // Username does not exist, log the error and redirect back
//                    if (!user){
//                        console.log('User Not Found with username '+username);
//                        return done(null, false, req.flash('message', 'User Not found.'));
//                      //  return done(null, false, {'title':'test'});
//                    }
//                    // User exists but wrong password, log the error 
//                    if (!isValidPassword(user, password)){
//                        console.log('Invalid Password');
//                        return done(null, false, req.flash('message', 'Invalid Password')); 
//                     //   return done(null, false, {'title':'test'}); 
//                        // redirect back to login page
//                    }
//                    // User and password both match, return user from done method
//                    // which will be treated like success
//                    req.session.user = user;
//                    return done(null, user);
//                }
//            );

var args = {
	data: {'username':username,'password':password},
	headers: { "Content-Type": "application/json" }
};
        client.post("http://localhost:4000/api/login", args, function (data, response) {
	// parsed response body as js object 
            if(data.message=="User Found")
                {
                    req.session.user = data.user;
                    return done(null, data.user);
                }
            else
               return done(null, false, req.flash('message', data.message)); 
});
        
        

        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
}