require("dotenv").config({ path: __dirname + "/../.env" });
const Page = require("../../models/page");

module.exports.getPages = async (req, res) => {
  try {
    let pages = await Page.find({})
      .sort("order")
      .exec();

    res.render("admin/pages", {
      pages,
      message: res.locals.message,
      color: res.locals.color
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
    let pages = await Page.find({})
      .sort("order")
      .exec();
    const page = await Page.findOne({ slug: req.params.slug });
    const shiftPageBack = pages.length + 1;

    res.render("admin/editPage", {
      page: page,
      maxOrder: shiftPageBack,
      message: res.locals.message,
      color: res.locals.color
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

    await page.save();
    req.flash("success", `Successfully created ${page.name}`);
    res.redirect("/admin/pages");
  } catch (err) {
    console.log(err);
  }
};
module.exports.deletePage = async (req, res) => {
  try {
    await Page.remove({ slug: req.params.slug });
    req.flash("success", `Successfully deleted ${page.name}`);
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
    await page.save();

    req.flash("success", `Successfully updated ${page.name}`);
    res.redirect("/admin/pages/edit/" + page.slug);
  } catch (err) {
    console.log(err);
  }
};
