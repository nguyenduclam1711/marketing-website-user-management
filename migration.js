"use strict";
require("dotenv").config({
  path: __dirname + "/.env"
});
const fs = require("fs");
const path = require("path");

const Employee = require("./models/employee");
const Partner = require("./models/partner");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
(async () => {
  try {
    const res = await Employee.find({ contact_user: { $exists: 1 } })
    await Promise.all(res.map(async res => {
      res.set('contact_user', undefined, { strict: false })
      await res.save()
    }))
    console.log(`Migration successful. Processed ${res.length} documents`);
    process.exit()
  } catch (error) {
    console.log('error', error);
  }
})();

(async () => {
  try {
    const localesFolder = path.resolve(__dirname, "locales");
    const util = require('util');
    const fs = require('fs');
    const Stringtranslation = require('./models/stringtranslation')

    const fsReaddir = util.promisify(fs.readdir);
    const fsReadFile = util.promisify(fs.readFile);
    const fsLstat = util.promisify(fs.lstat);

    async function searchFilesInDirectoryAsync(dir, filter, ext) {
      const enContent = JSON.parse(fs.readFileSync(`${localesFolder}/en.json`, { encoding: 'utf-8' }))
      const englishTranslationKeys = Object.keys(enContent)
      const files = await fsReaddir(dir).catch(err => {
        throw new Error(err.message);
      });
      const foundFiles = await getFilesInDirectoryAsync(dir, ext);
      const fileContents = await Promise.all(foundFiles
        .filter(ff => !ff.includes('admin'))
        .map(async (ff, index) => {
          return { path: ff, content: await fsReadFile(ff, 'utf8') };
        }))
      let index2 = 0
      const notFound = await englishTranslationKeys
        .filter(translationKey => {
          let foundWord = false
          for (let file of fileContents) {
            const regex = new RegExp(`[__|\\+translate]\\([\\"|\\']` + translationKey + `[\\"|\\']\\)`);
            if (regex.test(file.content)) {
              foundWord = true
            }
          };
          if (!foundWord) {
            index2++
            return translationKey
          }
        })
      const stringtranslations = await Stringtranslation.deleteMany({ 'title': { $in: notFound } })
      console.log('Translationdelete result: ', stringtranslations);
    }

    async function getFilesInDirectoryAsync(dir, ext) {
      let files = [];
      const filesFromDirectory = await fsReaddir(dir).catch(err => {
        throw new Error(err.message);
      });

      for (let file of filesFromDirectory) {
        const filePath = path.join(dir, file);
        const stat = await fsLstat(filePath);

        if (stat.isDirectory()) {
          const nestedFiles = await getFilesInDirectoryAsync(filePath, ext);
          files = files.concat(nestedFiles);
        } else {
          if (path.extname(file) === ext) {
            files.push(filePath);
          }
        }
      };

      return files;
    }
    (async () => {
      searchFilesInDirectoryAsync('./views', 'career', '.pug')
    })()
    console.log(`Migration successful. Processed ${res.length} documents`);
    process.exit()
  } catch (error) {
    console.log('error', error);
  }
})()
