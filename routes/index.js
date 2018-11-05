"use strict";
require("dotenv").config({ path: __dirname + "/../.env" });
const Story = require("../models/story");
const Contact = require("../models/contact");
const Category = require("../models/category");
const Location = require("../models/location");
const Course = require("../models/course");

const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");

//LANDING PAGE ROUTE
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find({})
      .populate("categories")
      .sort("order")
      .exec({});
    //const categories = await Category.find({story.categories}).exec({});
    const locations = await Location.find({})

    let courses = await Course.find({})
    // console.log(courses)

    res.render("index", {
      stories: stories,
      locations: locations,
      courses: courses
    });
  } catch (err) {
    console.log(err);
  }
});


router.post('/contact', async (req, res) => {
  var contact = new Contact(); // create a new instance of the contact model

  contact.name = req.body.name;
  contact.email = req.body.email;
  contact.body = req.body.body;
  contact.createdAt = new Date();

  contact.locations = req.body.locations;
  if (!contact.email) {
    res.redirect("/?alert=error")
  }

  contact.save(function (err) {
    if (err) res.send(err);
    console.log("Contact created:", contact);

    let transporter = nodemailer.createTransport({
      host: process.env.MAILHOST,
      port: process.env.MAILPORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPW
      }
    });

    //TODO Fix sending mails
    // setup email data with unicode symbols
    let mailOptions = {
      from: contact.name,
      to: process.env.MAILRECEIVER,
      subject: `Message from ${contact.name}`,
      text: `${contact.body}`,
      html: `${contact.body}`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
        res.redirect("/?alert=error");
      }
      console.log('#####', info);
      console.log("Message sent: %s", info.messageId);
    });

    res.redirect("/?alert=success");
  });
});
module.exports = router;
