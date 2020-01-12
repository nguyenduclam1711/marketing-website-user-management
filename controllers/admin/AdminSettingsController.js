require("dotenv").config({path: __dirname + "/../.env"});
const Stringtranslation = require("../../models/stringtranslation");
const Language = require("../../models/language");

module.exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.find({})
    let stringtranslations = await Stringtranslation.find({})
      .populate("translations.language")
      .exec();
    let languages = await Language.find({})
      .exec();
    res.render("admin/adminSettings", {
      settings,
      stringtranslations,
      languages
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.createStringtranslation = async (req, res) => {
  try {
    var stringtranslation = new Stringtranslation();
    stringtranslation.title = req.body.title;
    stringtranslation.translations = Object.keys(req.body.translations).map(trans => ({
      language: trans,
      title: req.body.translations[trans]
    }));
    stringtranslation.save(async function (err) {
      if (err) {
        let stringtranslations = await Stringtranslation.find({})
          .populate("translations.language")
          .exec();
        let languages = await Language.find({})
          .exec();
        console.log("error", err);
        req.flash("danger", `Error ${err}`);
        res.render("admin/adminSettings", {
          stringtranslations,
          stringtranslation,
          languages,
        });
        return;
      }
      req.flash("success", `Successfully created ${stringtranslation.title}`);
      res.redirect("/admin/settings");
    })
  } catch (err) {
    console.log(err);
  }
};
module.exports.deleteStringtranslation = async (req, res, next) => {
  try {
    const stringtranslation = await Stringtranslation.findById(req.params.id)
    await stringtranslation.remove()
    req.flash("success", `Successfully deleted ${stringtranslation.translations[0].title}`);
    res.redirect("/admin/settings");
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateStringtranslation = async (req, res) => {
  try {
    await Stringtranslation.findOneAndUpdate({_id: req.params.id}, {
      translations: Object.keys(req.body.translations).map(trans => ({
        language: trans,
        title: req.body.translations[trans]
      }))
    }).exec({});
    req.flash("success", `Successfully updated ${Object.values(req.body.translations)[0]}`);
    res.redirect("/admin/settings");
  } catch (err) {
    console.log(err);
  }
};
