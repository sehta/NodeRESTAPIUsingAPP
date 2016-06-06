var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
//  res.render('index', { title: 'Express' });
  res.render('login', { title: 'Login Page' });
});

 /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true 
  }));

module.exports = router;
