const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const { promisify } = require("util");
const nodemailer = require("nodemailer");
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const Location = require("../models/location");
const Event = require("../models/event");

const EmployeeController = require("../controllers/admin/AdminEmployeesController");
const fetch = require("node-fetch");

exports.fetchEventsByLocation = async () => {
  const locations = await Location.find({});
  let eventsByLocation = [];

  for await (let loc of locations) {
    eventsByLocation.push({
      name: loc.name,
      events: await Event.find({ location: loc._id })
        .populate("location")
        .sort({ start: -1 })
        .limit(3)
    });
  }
  return eventsByLocation;
};
console.log('process.env.CLIENT_SECRET', process.env.CLIENT_SECRET);
console.log('process.env.CLIENT_SECRET', process.env.CLIENT_ID);


exports.fetchTeam = async () => {
  if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
    const url = `https://api.personio.de/v1/auth`;
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    };
    try {
      return new Promise(async function (resolve, reject) {
        fetch(url, {
          method: "post",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(personioResponse => {
            if(personioResponse.error){
              console.log(error)
            }
            const employeeUrl = `https://api.personio.de/v1/company/employees?token=${personioResponse.data.token}`

            fetch(
              employeeUrl,
              {
                headers: { "Content-Type": "application/json" }
              }
            )
              .then(res => res.json())
              .then(async employeesFromPersonio => {
                await EmployeeController.fetchEmployees(employeesFromPersonio)
                resolve("Employees cronjob fetched");
              });
          }).catch(e => console.error(e));
      });
    } catch (err) {
      console.log(err);
      res.redirect("/admin/events?alert=created");
    }

    return team;
  } else {
    console.log(`No personio API credentials provided. process.env.CLIENT_ID process.env.CLIENT_SECRET must be declared in .env`)
  }

};
exports.isAdmin = req => req.user.admin !== "true";

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/users/login");
  }
};
module.exports.redirectNonAdmin = (req, res, next) => {
  if (req.user.admin === "true") {
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

    redisClient.on("error", function(error) {
      console.error("Redis ERROR: " + error);
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
exports.sendMail = async (req, mailOptions) => {
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
        console.log(error, info);
        req.flash("danger", `A error occured, please try it later again!`);
        res.redirect(req.headers.referer);
        reject(error);
      }
      resolve(info);
    });
  });
};
