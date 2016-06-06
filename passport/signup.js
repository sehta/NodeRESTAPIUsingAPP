var LocalStrategy   = require('passport-local').Strategy;
var User = require('../model/user');
var bCrypt = require('bcrypt-nodejs');
var Client = require('node-rest-client').Client;
 
var client = new Client();
module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

//            findOrCreateUser = function(){
//                 console.log('User');
//                  console.log(User)
//                // find a user in Mongo with provided username
//                User.findOne({ 'username' :  username }, function(err, user) {
//                    // In case of any error, return using the done method
//                    if (err){
//                        console.log('Error in SignUp: '+err);
//                        return done(err);
//                    }
//                    // already exists
//                    if (user) {
//                        console.log('User already exists with username: '+username);
//                      //  return done(null, false, req.flash('message','User Already Exists'));
//                          return done(null, false);
//                    } else {
//                        // if there is no user with that email
//                        // create the user
//                        var newUser = new User();
//
//                        // set the user's local credentials
//                        newUser.email = username;
//                        newUser.password = createHash(password);
//                        newUser.name = req.param('name');
//
//                        // save the user
//                        newUser.save(function(err) {
//                            if (err){
//                                console.log('Error in Saving user: '+err);  
//                                throw err;  
//                            }
//                            console.log('User Registration succesful');    
//                            return done(null, newUser);
//                        });
//                    }
//                });
//            };
//            // Delay the execution of findOrCreateUser and execute the method
//            // in the next tick of the event loop
//            process.nextTick(findOrCreateUser);
        
        
        var args = {
	data: {'username':username,'password':password,'name':req.param('name')},
	headers: { "Content-Type": "application/json" }
};
        client.post("http://localhost:4000/api/signup", args, function (data, response) {
	// parsed response body as js object 
            if(data.message=="User Registration succesful")
                {
                    req.session.user = data.user;
                    return done(null, data.user);
                }
            else
               return done(null, false, req.flash('message', data.message)); 
});
        
        
        
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}