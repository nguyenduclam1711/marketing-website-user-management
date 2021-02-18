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
})()
