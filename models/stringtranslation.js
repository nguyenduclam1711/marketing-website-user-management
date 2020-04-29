const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const StringtranslationSchema = new Schema({
  title: String,
  translations: [{
    language: {type: Schema.ObjectId, ref: "Language"},
    title: String
  }]
});
//TODO hooks function body is identical -> unify by finding a hook that servers create and update.
StringtranslationSchema.post("findOneAndUpdate", async function (doc, next) {
  const {updateLocaleFile} = require("../helpers/helper");
  await updateLocaleFile();
  next()
});
StringtranslationSchema.post("save", async function (doc, next) {
  const {updateLocaleFile} = require("../helpers/helper");
  await updateLocaleFile();
  next()
});
module.exports = mongoose.model("Stringtranslation", StringtranslationSchema);
