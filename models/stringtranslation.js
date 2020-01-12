const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const {updateLocaleFile} = require('../helpers/helper')

const StringtranslationSchema = new Schema({
  title: String,
  translations: [{
    language: {type: Schema.ObjectId, ref: "Language"},
    title: String
  }]
});

StringtranslationSchema.pre("findOneAndUpdate", async function (doc, next) {
  await updateLocaleFile()
  next();
});
module.exports = mongoose.model("Stringtranslation", StringtranslationSchema);
