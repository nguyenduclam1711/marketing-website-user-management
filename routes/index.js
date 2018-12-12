"use strict";
require("dotenv").config({ path: __dirname + "/../.env" });
const Story = require("../models/story");
const Contact = require("../models/contact");
const Category = require("../models/category");
const Location = require("../models/location");
const Course = require("../models/course");
const Event = require("../models/event");
const request = require("request");
const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
if(!process.env.AUTHORIZATION || !process.env.URL) {
  console.error("Please set a Mailchimp URL or AUTHORIZATION ApiKey in .env file")
  process.exit()
}

router.get("/", async (req, res) => {
  try {
    const stories = await Story.find({})
      .populate("categories")
      .sort("order")
      .exec({});
    const locations = await Location.find({});

    let courses = await Course.find({});
    let events = [];
    for await (let loc of locations) {
      if (!events) {
        events[await Event.findOne({ location: loc._id }).populate("location")];
      } else {
        events.push(
          await Event.findOne({ location: loc._id }).populate("location")
        );
      }
    }

    res.render("index", {
      events,
      stories,
      locations,
      courses,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/contact", async (req, res) => {

  var contact = new Contact();

  contact.name = req.body.name;
  contact.email = req.body.email;
  contact.body = req.body.body;
  contact.createdAt = new Date();

  contact.locations = req.body.locations;
  if (!contact.email) {
    res.redirect(req.headers.referer);
  }

  contact.save(function(err) {
    if (err) res.send(err);

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
      to: process.env.MAILRECEIVER,
      subject: `Message on website`,
      text: `${contact.body}`,
      html: `${contact.body}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error, info);
        req.flash("danger", `A error occured, please try it later again!`);
        res.redirect(req.headers.referer);
      }

      req.flash("success", `Danke für deine Nachricht. Wir melden uns bei dir.`);
      console.log("Message sent: %s", info.messageId);

      res.redirect(req.headers.referer);
      next();
    });
  });
});

router.post("/newsletter-signup", function (req, res) {
  const { email } = req.body;
  console.log(req.body)

  // Make sure fields are filled
  if (!email) {
    return res.status(422).json({
      code: 422,
      message: "No valid email address given!"
    });
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed'
        // merge_fields: {}
      }
    ]
  };

  try {
    const postData = JSON.stringify(data);

    const options = {
      url: process.env.URL,
      method: 'POST',
      headers: {
        Authorization: process.env.AUTHORIZATION
      },
      body: postData
    };

    request(options, (err, response) => {
      if (err) {
        return res.json({
          code: response.statusCode,
          message: error.message
        });
      } else {
        const json = JSON.parse(response.body);
        console.log(json)
        if (response.statusCode === 200 && json.errors.length === 0) {
          return res.status(200).json({
            code: 200,
            message: "Successfully subscribed to the newsletter!"
          });
        } else {
          return res.status(422).json({
            code: json.errors ? 422 : response.statusCode,
            message: "error"
          });
        }
      }
    });
  } catch (err) {
    console.log(`A error occured in the newsletter subscription route \n\n ${err}`)
  }
})

module.exports = router;
