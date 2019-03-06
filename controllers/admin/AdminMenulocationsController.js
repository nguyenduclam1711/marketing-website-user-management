const Menulocation = require("../../models/menulocation");

module.exports.getMenulocations = async function (req, res) {
  //here we get the whole collection and sort by order
  let menulocations = await Menulocation.find({}).exec();
  res.render("admin/menulocations", {
    menulocations: menulocations,
  });
}


module.exports.editMenulocation = function (req, res) {
  Menulocation.findById(req.params.id, function (err, menulocation) {
    res.render("admin/editMenulocation", {
      menulocation: menulocation,
    });
  });
}
module.exports.createMenulocation = function (req, res) {
  var menulocation = new Menulocation(); // create a new instance of the menulocation model
  menulocation.name = req.body.name; // set the menulocations name (comes from the request)

  // save the menulocation and check for errors
  menulocation.save(function (err) {
    if (err) res.send(err);
    req.flash("success", `Successfully safed ${menulocation.name}`);
    res.redirect("/admin/menulocations");
  });
}

module.exports.deleteMenulocation = function (req, res) {
  Menulocation.remove(
    {
      _id: req.params.id
    },
    function (err, menulocation) {
      if (err) res.send(err);

      req.flash("success", `Successfully deleted ${menulocation.name}`);
      res.redirect("/admin/menulocations");
    }
  );
}
module.exports.updateMenulocation = function (req, res) {
  // use our menulocation model to find the menulocation we want
  Menulocation.findById(req.params.id, function (err, menulocation) {
    if (err) res.send(err);

    menulocation.name = req.body.name; // update the menulocations info

    // save the menulocation
    menulocation.save(function (err) {
      if (err) res.send(err);

      req.flash("success", `Successfully updated ${menulocation.name}`);
      res.redirect("/admin/menulocations/edit/" + menulocation._id );
    });
  });
}
