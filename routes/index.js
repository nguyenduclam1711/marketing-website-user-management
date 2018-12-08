"use strict";
require("dotenv").config({ path: __dirname + "/../.env" });
const Story = require("../models/story");
const Contact = require("../models/contact");
const Category = require("../models/category");
const Location = require("../models/location");
const Course = require("../models/course");
const Event = require("../models/event");
const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");

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
module.exports = router;
