const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const { promisify } = require("util");
const fs = require('fs')
const nodemailer = require("nodemailer");
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const Stringtranslation = require("../models/stringtranslation");
const util = require('util');
const fsReaddir = util.promisify(fs.readdir);
const fsReadFile = util.promisify(fs.readFile);
const fsLstat = util.promisify(fs.lstat);
exports.groupByKey = (items, key) => {
  return items.reduce(function (group, x) {
    (group[x[key]] = group[x[key]] || []).push(x);
    return group;
  }, {});
};
exports.isAdmin = req => req.user.admin === "true" || req.user.superAdmin === "true";


module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.session.redirectTo = req.originalUrl;
    res.redirect(`/users/login`);
  }
};
module.exports.redirectNonAdmin = (req, res, next) => {
  if (req.user.admin === "true") {
    return next();
  } else {
    return res.redirect("/admin/stories");
  }
};

module.exports.redirectNonSuperAdmin = (req, res, next) => {
  if (req.user.superAdmin === "true") {
    return next();
  } else {
    return res.redirect("/admin/stories");
  }
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      User.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        if (!user) {
          return done(null, false, {
            message: "Unknown User"
          });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Invalid password"
            });
          }
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

exports.mongopath =
  process.env.MONGOURL || "mongodb://localhost:27017/marketing-website";

exports.getAsyncRedis = () => {
  try {
    const redis = require("redis");
    const redisClient = redis.createClient({
      host: "127.0.0.1",
      port: 6379
    });

    redisClient.on("error", function (error) {
      console.log("Redis ERROR: " + error);
      process.exit();
    });

    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);

    return redisClient;
  } catch (err) {
    console.log(`Error occured in helper.js \n${err}`);
  }
};
exports.getRequestUrl = req => {
  return req.protocol + "://" + req.get("Host");
};
exports.sendMail = async (res, req, mailOptions) => {
  const envs = ["MAILHOST", "MAILPORT", "MAILUSER", "MAILPW"];
  if (Object.keys(process.env).filter(e => envs.includes(e)).length !== envs.length || !mailOptions.to) {
    console.log("Mailer env variables not set");
    return "Mailer env variables not set"
  }
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: process.env.MAILHOST,
      port: process.env.MAILPORT,
      auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPW
      }
    });

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Mailerror: ", error, info);
        reject(error);
      }

      resolve(info);
    });
  });
};


exports.updateLocaleFile = async () => {
  return new Promise(async (resolve, reject) => {
    const stringtranslations = await Stringtranslation.find({})
      .populate("translations.language")
      .exec();
    let locales = [];
    stringtranslations.map(strTrans => {

      strTrans.translations.map(string => {
        if (!!string.language) {
          locales[string.language.title] = locales[string.language.title] ? {
            ...locales[string.language.title],
            [strTrans.title]: string.title
          } : { [strTrans.title]: string.title }
        }
      })
    });

    let localesFolder = path.resolve(__dirname, "../locales");
    const promises = Object.entries(locales).map(([loc, value]) => {
      fs.writeFileSync(`${localesFolder}/${loc}.json`, JSON.stringify(value));
    });
    await Promise.all(promises)
    resolve();
  });
};

exports.getFbClid = (req, res, next) => {
  let fbc = /_fbc=(fb\.1\.\d+\.\w+)/.exec(req.headers.cookie);
  if (!(fbc && fbc[1])) {
    return null;
  }
  let fbclid = /\w{15,}/.exec(fbc[1]);
  if (!(fbclid && fbclid[0])) {
    return null;
  }
  return fbclid[0]
}

exports.searchFilesInDirectoryAsync = async (dir, filter, ext) => {
  const localesFolder = path.resolve(__dirname, "../", "locales");
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

  let templateTranslations = new Set()
  for (let file of fileContents) {
    [...file.content.matchAll(/[\s|=][\+translate|__]*\(["|'](.*)["|']\)/g)].map(i => templateTranslations.add(i[1]))
  }
  const databaseStringtranslations = await Stringtranslation.find()
  const missingTemplateKeysInDatabase = [...templateTranslations].filter(tt => {
    return !databaseStringtranslations.map(i => i.title).includes(tt.replace(/\\/, ''))
  })
  return missingTemplateKeysInDatabase
}

const getFilesInDirectoryAsync = async (dir, ext) => {
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
exports.jsonResponseObject = async (res, payload, error = undefined) => {
  if (error) {
    return res.status(500).json({ payload, error: error.toString() })
  } else {
    return res.json({ payload, error })
  }
}
