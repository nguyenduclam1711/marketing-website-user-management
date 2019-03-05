var passport = require("passport");
const uuid = require("uuid");

var User = require("../models/user");
var { sendMail, getRequestUrl } = require("../helper.js");

module.exports.renderLogin = (req, res) => {
  res.render("login");
};
module.exports.renderRegister = (req, res) => {
  res.render("register");
};
module.exports.register = async (req, res) => {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  // Validation
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    req.flash("danger", errors.map(i => i.msg).join(", "));
    res.render("register");
  } else {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      req.flash("danger", `Email already taken`);
      res.redirect("/users/register");
    } else {
      const userToken = uuid(4);
      var newUser = new User({
        email: email,
        username: username,
        password: password,
        token: userToken
      });

      User.createUser(newUser, async (err, user) => {
        if (err) throw err;
        const verificationLink = `${getRequestUrl(
          req
        )}/users/verify/${userToken}`;
        const mailOptions = {
          from: "verification@digitalcareerinstitute.org",
          to: email,
          subject: "Verify your account on digitalcareerinstitute.org",
          text: `By clicking on the following link, you verify your account <a href="${verificationLink}">${verificationLink}</a>`,
          html: `By clicking on the following link, you verify your account <a href="${verificationLink}">${verificationLink}</a>`
        };
        await sendMail(req, mailOptions);

        req.flash(
          "success",
          `Email ${email} registered. Please check your mails for verification.`
        );
        res.redirect("/users/login");
      });
    }
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

module.exports.verify = async function(req, res, next) {
  const user = await User.findOne({ token: req.params.token });
  console.log("user", user);
  if (!user) {
    req.flash("danger", `Token ${req.parmas.token} not found!`);
    return res.redirect("/users/register");
  } else {
    user.verifiedAt = new Date();
    req.flash("success", `Email ${user.email} verified!`);
    await user.save();
    return res.redirect("/users/login");
  }
};
module.exports.logout = (req, res) => {
  req.logout();
  res.redirect("/users/login");
};
