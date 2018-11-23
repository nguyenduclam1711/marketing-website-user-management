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
const Event = require("./models/event");

const EventsController = require('./controllers/admin/AdminEventsController');

const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR;

const categories = [
  {
    name: "Hard"
  },
  {
    name: "Easy"
  }
];

const adminUser = {
  name: 'admin',
  email: 'admin@example.com',
  username: 'admin',
  password: '$2a$10$.D.ObRTjFkv4X0zyLCOE3ui9FKU1GveILRgvhQMWlIl2q3jbgnNoi', //password
};

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
    content: `Become an Instructor
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

const stories = [
  {
    title: "Voluptatem sunt similique non ",
    alumniName: "Daniela",
    workPosition: "Ikea, Full-Stack Developer",
    excerpt: "Daniela is one of our best students and an important part of the student community here at DCI campus.",
    content: "The story of Jenny which has a super cool job as a Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 1,
    image: 'example_image_1.jpg'
  },
  {
    title: "Volsggdsg sytyt sgfdhgfhgjg ",
    alumniName: "Jürgen",
    workPosition: "Zalando, Full-Stack Developer",
    excerpt: "Jürgen recently landed a job as a Junior Front-End Engineer at streaming provider Loots here in Berlin.",
    content:  "Back in the days she was a bit introvert but now she can handle a lot of strange situations with her colleagues without any problem. Talking in front of many people Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 2,
    image: 'example_image_2.jpg'
  },
  {
    title: "Qui mollt itia sit animi quisquam et nostrud consequatur Facilis dignissimo",
    alumniName: "Manny",
    workPosition: "Amazon, Front-end Developer",
    excerpt: "Manny recently landed a job as a Junior Full-Stack Engineer at streaming provider Loots here in Berlin.",
    content:  "Stuart bit introvert but now she can handle a lot of strange situations with her colleagues without any problem. Talking in front of many people Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum. Porta ac consectetur ac, vestibulum at eros. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.",
    order: 3,
    image: 'example_image_3.jpg'
  }
];

const courses = [
  {
    headline: "One to One Coaching",
    subheading: "Write here something...",
    title: "Figure out what tech job is for You",
    subtitle: "Take special one to one 40 hours of coaching to find out what digital jobs suits you best. We learn hands-on from people working in the tech scene",
    archivements: [
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Write here something..."
      },
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Write here something..."
      },
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Write here something..."
      }
    ],
    features: [
      {
        title: "Write here something...",
        subtitle: "Write here something...",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/javascript-hand-drawn-file.png"
      },
      {
        title: "Write here something...",
        subtitle: "Write here something...",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/sql-file-format-symbol.png"
      },
      {
        title: "Write here something...",
        subtitle: "Write here something...",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/github-logo.png"
      },
      {
        title: "Write here something...",
        subtitle: "Write here something...",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/project-manager.png"
      }
    ],
    timeline: [
      {
        title: "Coffee & Code",
        subtitle: "Self paced learning session",
        time: "09:00"
      },
      {
        title: "Lesson",
        subtitle: "Teacher summary + Group discussion + Quick test",
        time: "10:30"
      },
      {
        title: "Lunch & Buddy Meetupe",
        subtitle: "Lunch, buddy lunch once a week",
        time: "12:00"
      },
      {
        title: "Project Work",
        subtitle: "Work on assignments to develop practical skills in a structured and supportive environment",
        time: "12:30"
      },
      {
        title: "Language Course",
        subtitle: "Learn and improve your German and English with Expert instructors",
        time: "16:00"
      }
    ]
  },
  {
    headline: "Orientation Course",
    subheading: "Find out what tech job are you passionate about",
    title: "Figure out which pathway suits you",
    subtitle: "Take 4 weeks and find out which digital jobs suits you best. We visit the best tech companies and learn hands-on from people working there.",
    archivements: [
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Introduction to Tech"
      },
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Company Tours"
      },
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Soft Skills"
      }
    ],
    features: [
      {
        title: "Technical Introduction",
        subtitle: "Internet, Browser, Coding Languages and Web Development",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/javascript-hand-drawn-file.png"
      },
      {
        title: "Soft skills",
        subtitle: "Discover and Measure one’s Personality, Behaviour as Employee and Teamwork",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/sql-file-format-symbol.png"
      },
      {
        title: "Company Tours",
        subtitle: "Take a tour of a local startup and see what the work environment is all about",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/github-logo.png"
      },
      {
        title: "Find your passion",
        subtitle: "Figure out which career path you want to take to achieve your dreams",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/project-manager.png"
      }
    ],
    timeline: [
      {
        title: "Coffee & Code",
        subtitle: "Self paced learning session",
        time: "09:00"
      },
      {
        title: "Lesson",
        subtitle: "Teacher summary + Group discussion + Quick test",
        time: "10:00"
      },
      {
        title: "Lunch & Buddy Meetupe",
        subtitle: "Lunch, buddy lunch once a week",
        time: "13:00"
      },
      {
        title: "Project Work",
        subtitle: "Work on assignments to develop practical skills in a structured and supportive environment",
        time: "14:00"
      },
      {
        title: "Office Hours & Homework",
        subtitle: "Get one to one time with instructors. Students often stay late to work together and solve problems before heading home. Make the most of your 9 months!",
        time: "17:00"
      }
    ]
  },
  {
    headline: "Web Development Course",
    subheading: "Become a web developer in 12 months",
    title: "Start Your Career in Web Development",
    subtitle: "Want to become a professional web developer? This is how it’s done. In this intensive, fully immersive 12-months course with 11-months of learning and 3-months internship, we’ll teach you everything you need to know to unlock your spot in one of the fastest-growing industries.",
    archivements: [
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Learn from professional developers"
      },
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Develop your own project"
      },
      {
        icon: "https://digitalcareerinstitute.org/wp-content/uploads/2017/04/students-on-class.png",
        description: "Ongoing career placement support"
      }
    ],
    features: [
      {
        title: "Programming basics",
        subtitle: "Learn the core skills of development – a beginner-friendly stack HTML, CSS and JavaScript",
        icon:"https://digitalcarlearnedeerinstitute.org/wp-content/uploads/2017/04/javascript-hand-drawn-file.png"
      },
      {
        title: "Specialisation",
        subtitle: "Specialise in technologies like Angular, Node.js and Databases",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/sql-file-format-symbol.png"
      },
      {
        title: "Team Work in Development",
        subtitle: "Learn to work on a project with other developers",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/github-logo.png"
      },
      {
        title: "Project Management",
        subtitle: "Learn agile project management and tools like scrum",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/project-manager.png"
      },
      {
        title: "Internship",
        subtitle: "your steps into the job, do an internship in a tech company to apply what you have learned",
        icon:"https://digitalcareerinstitute.org/wp-content/uploads/2017/04/project-manager.png"
      }
    ],
    timeline: [
      {
        title: "Coffee & Code",
        subtitle: "Self paced learning session",
        time: "09:00"
      },
      {
        title: "Lesson",
        subtitle: "Teacher summary + Group discussion + Quick test",
        time: "10:30"
      },
      {
        title: "Lunch & Buddy Meetupe",
        subtitle: "Lunch, buddy lunch once a week",
        time: "12:00"
      },
      {
        title: "Project Work",
        subtitle: "Work on assignments to develop practical skills in a structured and supportive environment",
        time: "12:30"
      },
      {
        title: "Language Course",
        subtitle: "Learn and improve your German and English with Expert instructors",
        time: "16:00"
      }
    ]
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
  await Story.deleteMany();
  await Category.deleteMany();
  await Location.deleteMany();
  await Course.deleteMany();
  await Contact.deleteMany();
  await Page.deleteMany();
  await User.deleteMany();
  await Event.deleteMany();
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
