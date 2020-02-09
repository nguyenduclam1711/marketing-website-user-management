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
      user.verifiedAt = new Date();
      req.flash("success", `${user.username} verified`);
    } else if (user.admin === "true" && user._id !== req.user._id) {
      user.admin = "false";
      req.flash("success", `${user.username} is now ${user.admin === "true" ? `admin` : `not admin anymore`}`);
    } else {
      user.admin = "true";
      req.flash("success", `${user.username} is now ${user.admin === "true" ? `admin` : `not admin anymore`}`);
    }
    await user.save();
    res.redirect("/admin/users");
  } else {
    req.flash("danger", `Sorry, just superadmins can do that.`);
    res.redirect("/admin/users");
  }
};
