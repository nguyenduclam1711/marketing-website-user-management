require("dotenv").config({ path: __dirname + "/../.env" });
const multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");
const jimp = require("jimp");
const Location = require("../../models/location");

const Course = require("../../models/course");

module.exports.getCourses = async function(req, res) {
  let courses = await Course.find({})
    .sort("order")
    .exec();

  res.render("admin/adminCourses", {
    courses
  });
};

module.exports.getSingleCourse = function(req, res) {
  Course.findOne({ slug: req.params.slug }, function(err, course) {
    res.render("course", {
      course
    });
  });
};
module.exports.editCourse = async function(req, res) {
  const course = await Course.findOne({ slug: req.params.slug });
  let alllocations = await Location.find({}).exec();
  all = alllocations.map(loc => {
    let match = course.locations
      .map(pcat => pcat.toString())
      .includes(loc._id.toString());

    if (match) {
      return Object.assign({ selected: true }, loc._doc);
    } else {
      return loc._doc;
    }
  });

  res.render("admin/editCourse", {
    course,
    locations: all
  });
};
module.exports.createCourse = async function(req, res) {
  var course = await new Course();
  course.headline = req.body.headline;
  course.title = req.body.title;
  course.subheading = req.body.subheading;
  course.subtitle = req.body.subtitle;
  course.locations = req.body.locations;
  course.icon = req.body.icon;
  course.archivements = [
    {
      icon: req.body.archivement_icon_1,
      description: req.body.archivement_description_1
    },
    {
      icon: req.body.archivement_icon_2,
      description: req.body.archivement_description_2
    },
    {
      icon: req.body.archivement_icon_3,
      description: req.body.archivement_description_3
    }
  ];
  course.timeline = [
    {
      title: req.body.timeline_time_1,
      subtitle: req.body.timeline_subtitle_1,
      time: req.body.timeline_time_1
    },
    {
      title: req.body.timeline_time_2,
      subtitle: req.body.timeline_subtitle_2,
      time: req.body.timeline_time_2
    },
    {
      title: req.body.timeline_time_3,
      subtitle: req.body.timeline_subtitle_3,
      time: req.body.timeline_time_3
    }
  ];

  // save the course and check for errors
  course.save(function(err) {
    if (err) {
      console.log("err", err);

      res.send(err);
    }
    req.flash("success", `Successfully created ${course.title}`);
    res.redirect("/admin/courses");
  });
};
module.exports.deleteCourse = function(req, res) {
  Course.remove(
    {
      slug: req.params.slug
    },
    function(err, course) {
      if (err) res.send(err);
      req.flash("success", `Successfully deleted ${course.name}`);
      res.redirect("/admin/courses");
    }
  );
};
// Storage settings for project images
const storage = multer.diskStorage({
  destination: function(request, file, next) {
    next(null, "./temp");
  },
  filename: function(request, file, next) {
    next(null, uuid(4));
  }
});
module.exports.uploadImages = multer({
  storage,
  limits: {
    fileSize: 10000000 // 10 MB
  },
  fileFilter(req, file, next) {
    if (file.mimetype.startsWith("image/")) {
      next(null, true);
    } else {
      next({ message: "That filetype is not allowed!" }, false);
    }
  }
}).fields([
  { name: "icon", maxCount: 1 },
  { name: "archivement_icon_1", maxCount: 1 },
  { name: "archivement_icon_2", maxCount: 1 },
  { name: "archivement_icon_3", maxCount: 1 }
]);

// Resize the images with different thumbnail sizes
exports.resizeImages = async (request, response, next) => {
  if (!request.files) {
    next();
    return;
  }
  for await (const singleFile of Object.values(request.files)) {
    const extension = singleFile[0].mimetype.split("/")[1];
    request.body[singleFile[0].fieldname] = `${
      singleFile[0].filename
    }.${extension}`;

    const image = await jimp.read(singleFile[0].path);
    await image.cover(350, 180);
    await image.write(
      `${process.env.IMAGE_UPLOAD_DIR}/${request.body[singleFile[0].fieldname]}`
    );
    fs.unlinkSync(singleFile[0].path);
  }
  next();
};

module.exports.updateCourse = async function(req, res) {
  req.body.archivements = [
    {
      icon: req.body.archivement_icon_1,
      description: req.body.archivement_description_1
    },
    {
      icon: req.body.archivement_icon_2,
      description: req.body.archivement_description_2
    },
    {
      icon: req.body.archivement_icon_3,
      description: req.body.archivement_description_3
    }
  ];
  req.body.timeline = [
    {
      title: req.body.timeline_time_1,
      subtitle: req.body.timeline_subtitle_1,
      time: req.body.timeline_time_1
    },
    {
      title: req.body.timeline_time_2,
      subtitle: req.body.timeline_subtitle_2,
      time: req.body.timeline_time_2
    },
    {
      title: req.body.timeline_time_3,
      subtitle: req.body.timeline_subtitle_3,
      time: req.body.timeline_time_3
    }
  ];
  const course = await Course.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).exec();

  req.flash("success", `Successfully updated ${course.title}`);

  res.redirect("/admin/courses/edit/" + req.params.slug);
};
