var passport = require('passport');

var User = require('../models/user');

module.exports.renderLogin = (req, res) => {
  res.render('login');
}
module.exports.renderRegister = (req, res) => {
  res.render('register');
}
module.exports.register = (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });
    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      console.log(user);
    });
    res.redirect('/users/login');
  }
}
module.exports.login = passport.authenticate('local', {
    successRedirect: '/admin/contacts',
    failureRedirect: '/users/login'
  }),
  (req, res) => {
    res.redirect('/');
  }
module.exports.logout = (req, res) => {
  req.logout();
  res.redirect('/users/login');
}
