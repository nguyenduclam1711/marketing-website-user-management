require('dotenv').config({ path: __dirname + '/../.env' });
const request = require("request");
const Page = require("../models/page");

module.exports.getPages = async function(req, res) {
  let pages = await Page.find({})
    .sort("order")
    .exec();

  res.render("pages", {
    pages: pages
  });
}


module.exports.getSinglePage = function(req, res) {
  Page.findById(req.params.id, function(err, page) {
    res.render("page", {
      page: page
    });
  });
}
