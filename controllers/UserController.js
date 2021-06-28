const passport = require("passport");
const { check, validationResult } = require("express-validator");
const uuid = require("uuid");

const User = require("../models/user");
const { sendMail, getRequestUrl } = require("../helpers/helper");

module.exports.conditionalRenderLogin = (req, res) => {
  if (req.user) {
    res.redirect("/admin");
  }
  res.render("login");
};
module.exports.renderRegister = (req, res) => {
  if (req.user) {
    res.redirect("/admin");
  }
   res.render("register");
};
sendVerificationMail = async (res, req, userToken) => {
  const verificationLink = `${getRequestUrl(req)}/users/verify/${userToken}`;
  const mailOptions = {
    from: "verification@digitalcareerinstitute.org",
    to: req.body.email,
    subject: "Verify your account on digitalcareerinstitute.org",
  text: `By opening the following link in your browser, you verify your account: ${verificationLink}. Please consider that your account is not activated yet. Contact one of the staff members to request the activation of your account. `,
    html: `By clicking on the following link, you verify your account <a href="${verificationLink}">${verificationLink}</a>. <br/><br/><strong>Please consider that your account is not activated yet. <br/> Contact one of the staff members to request the activation of your account.</strong> `
  };
  return await sendMail(res, req, mailOptions);
};
module.exports.register = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash(
      "danger",
      errors
        .array()
        .map(i => i.msg)
        .join(", ")
    );
    req.flash(
      "error",
      `There are some errors: ${JSON.stringify(errors)}`
    );
    res.render("register", {
      user: { email, username },
      error: errors.array().map(i => i.msg)
        .join(", ")
    });
  } else {
    try {
      const userToken = uuid(4);
      const newUser = new User({
        email: email,
        username: username,
        password: password,
        token: userToken
      });
      User.createUser(newUser, async (err, user) => {
        console.log(err)
        if (err) throw err;
        try {
          await sendVerificationMail(res, req, userToken);
          req.flash(
            "success",
            `Email ${email} registered. Please check your mails for verification.`
          );
          renderLogin(req, res, next, user)
        } catch (e) {
          console.error(e)
          req.flash("danger", `A error occured, please try it later again!`);
          res.redirect(req.headers.referer);
        }
      });
    } catch (error) {
      console.log(error)
      res.redirect(req.headers.referer);
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
      renderLogin(req, res, next, user)
    } else if (!user.verifiedAt) {
      req.flash("danger", `Account not verified`);
      renderLogin(req, res, next, user)
    } else if (!user.activatedAt) {
      req.flash("danger", `Account not activated yet. Please contact thomas.kuhnert@digitalcareerinstitute.org`);
      renderLogin(req, res, next, user)
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        req.flash("success", `Welcome ${user.username}!`);
        return res.redirect(req.session.redirectTo ? req.session.redirectTo : "/admin/settings");
      });
    }
  })(req, res, next);
};

const renderLogin = function (req, res, next, user) {
  res.render("login", { user });
}

module.exports.verify = async function(req, res, next) {
  const user = await User.findOne({ token: req.params.token });
  if (!user) {
    req.flash("danger", `Token ${req.parmas.token} not found!`);
    return res.redirect("/users/register");
  } else {
    user.verifiedAt = new Date();
    req.flash("success", `Email ${user.email} verified!`);
    await user.save();
    return renderLogin(req, res, next, user)
  }
};
module.exports.logout = (req, res, next) => {
  req.logout();
  renderLogin(req, res, next)
};
