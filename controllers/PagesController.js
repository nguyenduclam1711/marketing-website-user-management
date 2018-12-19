require('dotenv').config({ path: __dirname + '/../.env' });
const Page = require("../models/page");

module.exports.getPages = async function(req, res) {
  let pages = await Page.find({})
    .populate("categories")
    .sort("order")
    .exec();

  res.render("pages", {
    pages
  });
}


module.exports.getSinglePage = async (req, res) => {
  try {
    const page = await Page.findOne({ "slug": req.params.slug })
    res.render(`page`, {
      page
    });
  } catch (err) {
    console.log(err);
  }
}
