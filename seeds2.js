"use strict";
require("dotenv").config({
  path: __dirname + "/.env"
});
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
const Strintranslation = require("./models/stringtranslation");
const Language = require("./models/language");
const stringtranslations = require("./locales/de.json");

async function loadData() {
  try {
    const langs = await Language.find()
    const existingTranslations = await Strintranslation.find()
    const en = langs.find(l => l.title === 'en')._id
    const de = langs.find(l => l.title === 'de')._id
    const promises = Object.entries(stringtranslations).map(async ([key, value]) => {
      !existingTranslations.find(et => et.translations[0].title === key) && await Strintranslation.create({
        translations: [
          {
            language: en,
            title: key
          }, {
            language: de,
            title: value
          }]
      });
    })
    await Promise.all(promises);

    console.log("👍 Done!\n\n Successfully loaded sample data");
    process.exit();
  } catch (e) {
    console.log(
      "\n👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n"
    );
    console.log(e);
    process.exit();
  }
}

loadData();
