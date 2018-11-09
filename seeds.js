'use strict';
require("dotenv").config({
  path: __dirname + "/.env"
});
const fs = require("fs");
const request = require('request');

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

const Story = require("./models/story");
const Category = require("./models/category");
const Contact = require("./models/contact");
const Location = require("./models/location");
const Course = require("./models/course");
const Page = require("./models/page");



const categories = [
  {
    name: "Hard"
  },
  {
    name: "Easy"
  }
];

const pages = [
  {
    title: "Jobcenter/AA",
    content:
      `DCI Digital Career Institute gGmbH
        \n\r
        Zugelassener Träger für die Förderung der Beruflichen Weiterbildung nach dem Recht der Arbeitsförderung.
        \n\r
        Maßnahmen\n\r
        ERPROBUNGSCENTER DIGITALE BERUFE\n\r
        Berlin Maßnahmenummer:            922/0108/16\n\r
        \n\r
        Düsseldorf Maßnahmenummer:   337/31/17
        \n\r
        Hamburg Maßnahmenummer:     123/7195/18
        \n\r
        Dauer: 4 Wochen Vollzeit (160 UE)
        \n\r

        Diese Aktivierungs- und Vermittlungsmaßnahme nach §45 Abs. 1 Satz 1 Nr. 2 SGB III soll einen Einblick in den Bereich der digitalen Berufe gewähren. Hierbei ist die individuelle Betreuung und Förderung der Teilnehmer sowie der direkte Kontakt und Dialog mit Unternehmen maßgeblich. Um einen transparenten Eindruck der digitalen Arbeitswelt zu vermitteln, stehen unter anderem verschiedene, außergewöhnliche Exkursionen zu regionalen IT-Firmen im Fokus. Dadurch soll das persönliche Engagement und Leistungsbestreben der Teilnehmer gesteigert werden. Die praktischen und theoretischen Vermittlungseinheiten werden durch verschiedene Lehrkräfte und Dozenten aus regionalen ITUnternehmen realisiert. Bei Bedarf erhalten diese Unterstützung von einem Dolmetscher (Arabisch und Farsi), um sprachliche Barrieren abzubauen. Unsere Analyse der Teilnehmer arbeitet ihr Potential heraus, sodass aufbauend auf ihrem Persönlichkeitsprofil eine individuelle Selbstvermarktungs- und Bewerbungsstrategie entworfen werden kann.
        \n\r
        DIE WEITERBILDUNG ZUM WEB-PROGRAMMIERER (W/M)
        Berlin Maßnahmenummer:            922/0360/17
        \n\r
        Düsseldorf Maßnahmenummer:   337/1314/17
        \n\r

        Unsere Weiterbildung nach §81 SGB III ist modular aufgebaut und dauert maximal 13 Monate. Die Anzahl der Module richtet sich nach der persönlichen Vorerfahrung, sodass sich bei entsprechenden Vorkenntnissen die Ausbildungsdauer verkürzt. Die Module umfassen Grundlagen, Frontend-, Backend- und Datenbank-Entwicklung sowie QuellcodeVerwaltung, Entwicklungsverfahren und Projektmanagement.`,
    order: 1
  },
  {
    title: "Support us",
    content:
      `
        At Digital Career Institute  you learn the most relevant technology skills of today from Web Development, Digital Marketing, Product Management to Data.
        \n\r
        We train and  provide the necessary hardware and digital learning aids as well as a relevant mentoring and buddy system needed to get the digital skills of today’s age.`,
    order: 2
  },
  {
    title: "Become a buddy",
    content:
      `Digital Career Institute doesn’t only qualify refugees but also helps to integrate them. To keep ambitions and motivation of the participants high, we want to place a spiritual coach, a buddy, at their sides – you!

        \n\r
        Become a buddy
        Become part of the integration process. Take them by the hand. Light their path and keep them focused on their goals.

        \n\r
        What you bring with you
        Some practical experience in one or more of the following technologies or programming languages:

        \n\r
        HTML
        CSS
        Bootstrap
        jQuery
        Ruby on Rails
        Javascript
        Regardless of how much time you can commit, we are happy about everyone who can support our participants technically. Whether as a regular available buddy or hourly for questions in between.`,
    order: 3
  },
  {
    title: "Teach at DCI",
    content:
      `Become an Instructor
      EMPOWER PEOPLE TO PURSUE THE DIGITAL CAREERS THEY LOVE.
      Teach when you want
      FULL-TIME
      Join a talented team of instructors that teach daily.

      PART-TIME
      Lead a multi-week course.

      IN YOUR SPARE-TIME
      Share your knowledge in a class or workshop whenever it fits your schedule.

      Check out our open Positions`,
    order: 3
  }
];
var images = [
  'https://placekitten.com/400/300',
  'https://placekitten.com/400/301',
  'https://placekitten.com/400/302',
]
const stories = [
  {
    title: "Voluptatem sunt similique non ",
    name: "Finally arrived in cool company",
    workPosition: "Sunt est dicta obcaecati ",
    excerpt: "Occaecat voluptatem commodo sapiente unde",
    content:
      "The story of Jenny which has a super cool job as a Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 1,
    image: 'kitten1.jpg'
  },
  {
    title: "Volsggdsg sytyt sgfdhgfhgjg ",
    name: "Alice is a Do-er",
    workPosition: "Culpa ut deserunt rem voluptatem sunt id",
    excerpt: "Ea ex in est quisquam obcaecati rem qui non consequuntur quo qui",
    content:
      "Back in the days she was a bit introvert but now she can handle a lot of strange situations with her colleagues without any problem. Talking in front of many people Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 2,
    image: 'kitten2.jpg'
  },
  {
    title: "Qui mollitia sit animi quisquam et nostrud consequatur Facilis dignissimo",
    name: "Stuart struggles while doing so much Backend",
    workPosition: "Culpa ut deserunt rem voluptatem",
    excerpt: "Ea ex in est quisquam obcaecati rem qui non consequuntur quo qui",
    content:
      "Stuart bit introvert but now she can handle a lot of strange situations with her colleagues without any problem. Talking in front of many people Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 3,
    image: 'kitten3.jpg'
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
    content: "One month course",
    type: "orientation"
  },
  {
    name: "One year course",
    content: "One year course",
    type: "oneyear"
  },
  {
    name: "Coaching course",
    content: "Six months course",
    type: "coaching"
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
  console.log("😢 Goodbye Data...");
  await Story.remove();
  await Category.remove();
  await Location.remove();
  await Course.remove();
  await Contact.remove();
  await Page.remove();
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
    //console.log('#####', record);
  });
  return arrayOfRecords;
}
const downloadImages = async function(uri, filename, callback){
  return new Promise(function(resolve, reject) {
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', () =>{
        resolve('ya')
      });
    });
  });
};

async function seedRandomImages(arrayOfRecords, relationship, model) {
  const imageUploadDir = './uploads/images/'
  let index = 0
  var promises = []
  for await (let image of images){
    index++
    promises.push(downloadImages(image, `${imageUploadDir}/kitten${index}.jpg` ))
  }
  return promises
}
async function loadData() {
  try {
    const resp = await Promise.all(await seedRandomImages())
    console.log('#####', resp);
    const createdCategories = await Category.insertMany(categories);
    const createdLocations = await Location.insertMany(locations);
    const createdCourse = await Course.insertMany(courses);
    const createdPages = await Page.insertMany(pages);

    var associatedCategories = await seedRandomNtoN(stories, createdCategories, Category)
    var associatedLocations = await seedRandomNtoN(contacts, createdLocations, Location)

    await Story.insertMany(associatedCategories)
    await Contact.insertMany(associatedLocations)

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
