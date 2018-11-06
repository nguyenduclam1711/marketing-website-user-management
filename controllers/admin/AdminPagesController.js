require('dotenv').config({ path: __dirname + '/../.env' });
const request = require("request");
const Page = require("../../models/page");

module.exports.getPages = async function (req, res) {
  let pages = await Page.find({})
    .sort("order")
    .exec();

  res.render("admin/pages", {
    pages: pages,
    message: res.locals.message,
    color: res.locals.color
  });
}


module.exports.getSinglePage = function (req, res) {
  Page.findById(req.params.id, function (err, page) {
    res.render("page", {
      page: page,
    });
  });
}
module.exports.editPage = async function (req, res) {
  let pages = await Page.find({})
    .sort("order")
    .exec();
  Page.findById(req.params.id, async function (err, page) {
    const shiftPageBack = pages.length + 1

    res.render("admin/editPage", {
      page: page,
      maxOrder: shiftPageBack,
      message: res.locals.message,
      color: res.locals.color
    });
  });
}
module.exports.createPage = function (req, res) {
  var page = new Page(); 
  page.title = req.body.title; 
  page.content = req.body.content; 
  page.order = req.body.order; 

  page.save(function (err) {
    if (err) res.send(err);
    console.log("Page created:", page);
    res.redirect("/admin/pages?alert=created");
  });
}
module.exports.deletePage = function (req, res) {
  Page.remove( { _id: req.params.id },
    function (err, page) {
      if (err) res.send(err);

      console.log("Page deleted");
      res.redirect("/admin/pages?alert=deleted");
    }
  );
}
module.exports.updatePage = function (req, res) {
  Page.findById(req.params.id, function (err, page) {
    if (err) res.send(err);

    page.title = req.body.title;
    page.content = req.body.content;
    page.order = req.body.order;

    page.save(function (err) {
      if (err) res.send(err);

      console.log("Page updated:", page);
      res.redirect("/admin/pages/edit/" + page._id + "?alert=updated");
    });
  });
}
