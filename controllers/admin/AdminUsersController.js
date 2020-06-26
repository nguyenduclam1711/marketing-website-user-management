const Users = require("../../models/user");

module.exports.getUsers = async function (req, res) {
  let users = await Users.find({})
    .sort("-createdAt")
    .exec();

  res.render("admin/users", {users});
};

module.exports.upgradeUser = async function (req, res) {
  let user = await Users.findById(req.params.id);
  if (req.user.superAdmin === "true") {
    if (!user.verifiedAt) {
      req.flash("error", `${user.username} is not verified yet. First verify the email address`);
    } else if (user._id !== req.user._id && req.query.role) {
      if(req.query.role === 'admin'){
        user.admin = 'true';
      } else if(req.query.role === 'superadmin'){
        user.superAdmin = 'true';
      }
      req.flash("success", `${user.username} is now ${req.query.role}`);
    } else {
      user.admin = "false";
      user.superAdmin = "false";
      req.flash("success", `${user.username} is now normal user`);
    }
    await user.save();
    res.redirect("/admin/users");
  } else {
    req.flash("danger", `Sorry, just superadmins can do that.`);
    res.redirect("/admin/users");
  }
};

module.exports.verifyUser = async function (req, res) {
  let user = await Users.findById(req.params.id);
  if (req.user.superAdmin === "true") {
    if (!user.verifiedAt || !user.activatedAt) {
      user.verifiedAt = new Date();
      if (!user.activatedAt) {
        user.activatedAt = new Date();
      }
      await user.save();
      req.flash("success", `${user.username} verified`);
    } else {
      await user.collection.update({ _id: user._id }, { $set: { admin: "false", superAdmin: "false" }, $unset: { verifiedAt: 1, activatedAt: 1 } });
      req.flash("success", `${user.username} is deactivated now`);
    }
    res.redirect("/admin/users");
  } else {
    req.flash("danger", `Sorry, just superadmins can do that.`);
    res.redirect("/admin/users");
  }
};
