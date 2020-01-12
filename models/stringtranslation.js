const fs = require('fs')
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const StringtranslationSchema = new Schema({
  title: String,
  translations: [{
    language: {type: Schema.ObjectId, ref: "Language"},
    title: String
  }]
});
const updateLocaleFile = async () => {
  const stringtranslations = await StringtranslationModel.find({})
    .populate("translations.language")
    .exec();
  let locales = []
  stringtranslations.map(strTrans => {
    strTrans.translations.map(string => {
      locales[string.language.title] = locales[string.language.title] ? {
        ...locales[string.language.title],
        [strTrans.translations[0].title]: string.title
      } : {[strTrans.translations[0].title]: string.title}
    })
  })
  let localesFolder = "./locales";
  Object.entries(locales).map(([loc, value]) => {
    console.log(loc, value)
    fs.writeFileSync(`${localesFolder}/${loc}.json`, JSON.stringify(value));
  })
}

StringtranslationSchema.pre("findOneAndUpdate", async function (doc, next) {
  await updateLocaleFile()
  if (!!doc.languageVersion) {
    next()
  } else {
    next();
  }
});
let StringtranslationModel = mongoose.model("Stringtranslation", StringtranslationSchema);
module.exports = StringtranslationModel;
