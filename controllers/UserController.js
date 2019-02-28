var passport = require("passport");

var User = require("../models/user");

module.exports.renderLogin = (req, res) => {
  res.render("login");
};
module.exports.renderRegister = (req, res) => {
  res.render("register");
};
module.exports.register = (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    res.render("register", {
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
    });
    res.redirect("/users/login");
  }
};
module.exports.login = function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("danger", `${info.message}`);
      return res.redirect("/users/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome ${user.username}!`);
      return res.redirect("/admin/contacts");
    });
  })(req, res, next);
};
module.exports.logout = (req, res) => {
  req.logout();
  res.redirect("/users/login");
};
