"use strict";
require("dotenv").config({ path: __dirname + "/../.env" });
const request = require("request");
const express = require("express");
const router = express.Router();
const IndexController = require("../controllers/IndexController");

if (!process.env.AUTHORIZATION || !process.env.URL) {
  console.error(
    "Please set a Mailchimp URL or AUTHORIZATION ApiKey in .env file"
  );
  process.exit();
}

router.get("/", IndexController.landingpage);

router.post("/contact", IndexController.contact);

router.get("/tour", IndexController.tour);

router.post("/newsletter-signup", IndexController.newsletter);

router.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});

module.exports = router;
