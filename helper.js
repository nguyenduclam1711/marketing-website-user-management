const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const DOMAIN = process.env.DOMAIN || "localhost"
const PORT = process.env.PORT || 3000
const { promisify } = require('util');
const nodemailer = require("nodemailer");

var mongopath = process.env.MONGOURL || "mongodb://localhost:27017/marketing-website"
var url = `${DOMAIN}:${PORT}`

const getAsyncRedis = () => {
  try {
    const redis = require("redis");
    const redisClient = redis.createClient({
      host: "127.0.0.1",
      port: 6379
    });
  
    redisClient.on("error", function (error) {
      console.error("Redis ERROR: " + error);
      process.exit();
    })
  
    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
  
    return redisClient;
  }
  catch(err) {
    console.log(`Error occured in helper.js \n${err}`)
  }
}
const sendMail = async (req) => {
  
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: process.env.MAILHOST,
      port: process.env.MAILPORT,
      auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPW
      }
    });

    let mailOptions = {
      from: 'mailer@digitalcareerinstitute.org',
      to: req.body.companytour ? process.env.TOURMAILRECEIVER : process.env.MAILRECEIVER,
      subject: req.body.companytour ? `Company Tour request from website` : `Message on website`,
      text: `${req.body.body}`,
      html: `${req.body.body}`
    };

    transporter.sendMail(mailOptions, async (error, info) => {

      if (error) {
        return console.log(error, info);
        req.flash("danger", `A error occured, please try it later again!`);
        res.redirect(req.headers.referer);
        reject(error)
      }
      resolve(info)
    });
  })

}
module.exports = { url, mongopath, getAsyncRedis, sendMail }
