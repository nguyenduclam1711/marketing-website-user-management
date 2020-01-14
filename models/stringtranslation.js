const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const StringtranslationSchema = new Schema({
  title: String,
  translations: [{
    language: {type: Schema.ObjectId, ref: "Language"},
    title: String
  }]
});
StringtranslationSchema.post("findOneAndUpdate", async function (doc, next) {
  const {updateLocaleFile} = require("../helpers/helper");
  await updateLocaleFile();
  next()
});
module.exports = mongoose.model("Stringtranslation", StringtranslationSchema);
