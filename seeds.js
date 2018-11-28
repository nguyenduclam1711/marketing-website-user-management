'use strict';
require("dotenv").config({
  path: __dirname + "/.env"
});
const fs = require("fs");
const request = require('request');

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

const Story = require("./models/story");
const User = require("./models/user");
const Category = require("./models/category");
const Contact = require("./models/contact");
const Course = require("./models/course");
const Location = require("./models/location");
const Page = require("./models/page");
const Job = require("./models/job");
const Event = require("./models/event");

const EventsController = require('./controllers/admin/AdminEventsController');

const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR;

const {categories, stories, jobs, pages, courses, users, events, adminUser, contacts} = require('./seeddata')

async function deleteData() {
  console.log("😢 Goodbye Data...");
  await Story.deleteMany();
  await Category.deleteMany();
  await Location.deleteMany();
  await Course.deleteMany();
  await Contact.deleteMany();
  await Page.deleteMany();
  await User.deleteMany();
  await Event.deleteMany();
  await Job.deleteMany();
  console.log("Data Deleted. To load sample data, run\n\n\t npm run seeds\n\n");
  process.exit();
}

async function seedRandomNtoN(arrayOfRecords, relationship, model) {
  arrayOfRecords.map((record, index) => {
    var randomSetter = Math.floor(Math.random(relationship.length) * relationship.length + 1);
    record[model.collection.name] = [];
    for (let i = 0; i < randomSetter; i++) {
      return record[model.collection.name][i] = relationship[randomSetter - 1]._id.toString();
    }
  });
  return arrayOfRecords;
}
const downloadImages = async function (uri, filename, callback) {
  return new Promise(function (resolve, reject) {
    request.head(uri, function (err, res, body) {
      if (err) {
        console.log('error', err);
      }
      request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
        resolve()
      });
    });
  });
};

const imageUploadDir = IMAGE_UPLOAD_DIR;
async function seedRandomImages(arrayOfRecords, relationship, model) {
  var images = [
    'http://place-hoff.com/400/300',
    'http://place-hoff.com/400/301',
    'http://place-hoff.com/400/302',
  ]
  let index = 0
  var promises = []
  for await (let image of images) {
    index++
    promises.push(downloadImages(image, `${imageUploadDir}/example_image_${index}.jpg`))
  }
  return promises
}
async function loadData() {
  try {
    const resp = await Promise.all(await seedRandomImages())
    console.log(`Images saved to ${imageUploadDir}`);
    const createdCategories = await Category.insertMany(categories);
    const response = await EventsController.fetchevents();
    const createdLocations = await Location.find();
    const createdCourse = await Course.insertMany(courses);
    const createdPages = await Page.insertMany(pages);

   const user = await User.create(adminUser)
    console.log(`You can now login as:`)
    console.log(adminUser)

    var associatedCategories = await seedRandomNtoN(stories, createdCategories, Category)
    var associatedLocations = await seedRandomNtoN(contacts, createdLocations, Location)
    var associatedJobs = await seedRandomNtoN(jobs, createdLocations, Location)

    await Story.insertMany(associatedCategories)
    await Contact.insertMany(associatedLocations)
    await Job.insertMany(associatedJobs)

    console.log("👍 Done!\n\n Successfully loaded sample data");
    process.exit();
  } catch (e) {
    console.log(
      "\n👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n"
    );
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes("--delete")) {
  deleteData();
} else {
  loadData();
}
