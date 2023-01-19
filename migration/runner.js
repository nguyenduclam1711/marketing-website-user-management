"use strict";
// usage: node runner.js migration_file.js

const path = require('path')
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env")
});

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
if (!process.argv[2]) {
  console.log('usage: node runner.js migration')
  process.exitCode = 1
}

const migrationFile = process.argv[2]

try {
  const { migration } = require(`./${migrationFile}`);
  (async () => {
    const migrationRes = await migration()
    console.log(migrationRes);
  })()
} catch (e) {
  console.log(e)
  process.exitCode = 2
}
