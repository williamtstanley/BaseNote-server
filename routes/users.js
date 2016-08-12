var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();


router.get('/register', function(req, res) {
    res.render('users/register', { });
});

router.post('/register', function(req, res) {
  params = req.body;
  newUser = new User({
    firstName: params.firstName,
    lastName: params.lastName,
    role: params.role,
    email: params.email
  });
  console.log("req'd post request");  
  User.register(newUser, req.body.password, function(err, account) {
      if (err) {
        if (err.name === 'ValidationError') {
          return res.render("/register", {info: err.errors.email.message, data: req.body})
        }else if(err.name === 'UserExistsError'){
          return res.render("/register", {info: "So sorry a user with that email address already exists."})
        }
      }
      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    });
});

router.get('/login', function(req, res) {
    res.render('users/login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
