require("dotenv").config({ path: __dirname + "/../.env" });
const Page = require("../../models/page");
const Category = require("../../models/category");

module.exports.getPages = async (req, res) => {
  try {
    let pages = await Page.find({})
      .sort("order")
      .populate("categories")
      .exec();
    let categories = await Category.find({}).exec();

    res.render("admin/pages", {
      categories,
      pages
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getSinglePage = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    res.render(`page`, {
      page
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.editPage = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });

    let pages = await Page.find({})
      .sort("order")
      .populate("categories")
      .exec();
    let categories = await Category.find({}).exec();
    let allcategories = await Category.find({}).exec();

    all = allcategories.map(cat => {
      let match = page.categories
        .map(pcat => pcat.toString())
        .includes(cat._id.toString());

      if (match) {
        return Object.assign({ selected: true }, cat._doc);
      } else {
        return cat._doc;
      }
    });
    const shiftPageBack = pages.length + 1;

    res.render("admin/editPage", {
      page,
      categories: all,
      maxOrder: shiftPageBack
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.createPage = async (req, res) => {
  try {
    var page = new Page();
    page.title = req.body.title;
    page.content = req.body.content;
    page.order = req.body.order;
    page.categories = req.body.categories;

    await page.save();
    req.flash("success", `Successfully created ${page.title}`);
    res.redirect("/admin/pages");
  } catch (err) {
    console.log(err);
  }
};
module.exports.deletePage = async (req, res) => {
  try {
    const page = await Page.remove({ slug: req.params.slug });
    req.flash("success", `Successfully deleted ${page.title}`);
    res.redirect("/admin/pages");
  } catch (err) {
    console.log(err);
  }
};
module.exports.updatePage = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });

    page.title = req.body.title;
    page.content = req.body.content;
    page.order = req.body.order;
    page.categories = req.body.categories;
    await page.save();

    req.flash("success", `Successfully updated ${page.title}`);
    res.redirect("/admin/pages/edit/" + page.slug);
  } catch (err) {
    console.log(err);
  }
};
