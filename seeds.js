'use strict';
require("dotenv").config({
  path: __dirname + "/.env"
});
const fs = require("fs");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

const Story = require("./models/story");
const Category = require("./models/category");
const Contact = require("./models/contact");
const Location = require("./models/location");
const Course = require("./models/course");

const categories = [
  {
    name: "Hard"
  },
  {
    name: "Easy"
  }
];
const stories = [
  {
    name: "Finally arrived in cool company",
    content:
      "The story of Jenny which has a super cool job as a Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 1
  },
  {
    name: "Alice is a Do-er",
    content:
      "Back in the days she was a bit introvert but now she can handle a lot of strange situations with her colleagues without any problem. Talking in front of many people Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 2
  },
  {
    name: "Stuart struggles while doing so much Backend",
    content:
      "Stuart bit introvert but now she can handle a lot of strange situations with her colleagues without any problem. Talking in front of many people Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 3
  }
];

const locations = [
  {
    name: "Berlin",
    address: "Vulkanstrasse 1, 10499 Berlin"
  },
  {
    name: "Hamburg",
    address: "Hafenstrasse 1, 20499 Hamburg"
  }
]

const courses = [
  {
    name: "Orientation course",
    content: "One month course"
  },
  {
    name: "One year course",
    content: "One year course"
  },
  {
    name: "Coaching course",
    content: "Six months course"
  }
]

const date = new Date().getTime()
const contacts = [
  {
    name: "Brian Willson",
    email: "fijiwypoh@mailinator.net",
    body:
      "Fugit quia excepteur ipsam anim molestiae est elit animi ut ad est ut",
    createdAt: new Date(date - 86400000).toISOString(),
    updatedAt: new Date(),
  },
  {
    name: "Jasper Wynn",
    email: "blablu@gmail.com",
    body:
      "Fugit quia excepteur ipsam anim molestiae est elit animi ut ad est ut",
    createdAt: new Date(date - 86400000).toISOString(),
    updatedAt: new Date(),
  },
  {
    name: "Sonia Romero",
    email: "fritz@gmx.com",
    body:
      "Quidem dolorum ex qui quis rerum culpa laboriosam doloremque excepturi voluptatum blanditiis cum",
    createdAt: new Date(date - 86400000).toISOString(),
    updatedAt: new Date(),
  }
];

async function deleteData() {
  console.log("😢😢 Goodbye Data...");
  await Story.remove();
  await Category.remove();
  await Location.remove();
  await Course.remove();
  await Contact.remove();
  console.log("Data Deleted. To load sample data, run\n\n\t node seeds.js\n\n");
  process.exit();
}

async function seedRandomNtoN(arrayOfRecords, relationship, model) {
  arrayOfRecords.map((record, index) => {
    var randomSetter = Math.floor(Math.random(relationship.length) * relationship.length + 1);
    record[model.collection.name] = [];
    for (let i = 0; i < randomSetter; i++) {
      return record[model.collection.name][i] = relationship[randomSetter - 1]._id.toString();
    }
    //console.log('#####', record);
  });
  return arrayOfRecords;
}

async function loadData() {
  try {
    const createdCategories = await Category.insertMany(categories);
    const createdLocations = await Location.insertMany(locations);
    const createdCourse = await Course.insertMany(courses);

    var associatedCategories = await seedRandomNtoN(stories, createdCategories, Category)
    var associatedLocations = await seedRandomNtoN(contacts, createdLocations, Location)
    var a = await Story.insertMany(associatedCategories)
    var b = await Contact.insertMany(associatedLocations)

    console.log('#####', a);
    console.log("👍 Done!");
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
