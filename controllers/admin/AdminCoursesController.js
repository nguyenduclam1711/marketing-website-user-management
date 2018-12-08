require("dotenv").config({ path: __dirname + "/../.env" });
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
  Course.findById(req.params.id, function(err, course) {
    res.render("course", {
      course
    });
  });
};
module.exports.editCourse = async function(req, res) {
  Course.findById(req.params.id, async function(err, course) {
    res.render("admin/editCourse", {
      course
    });
  });
};
module.exports.createCourse = function(req, res) {
  var course = new Course(); // create a new instance of the course model
  course.title = req.body.title; // set the courses title (comes from the request)
  course.alumniName = req.body.alumniName; // set the courses alumni name (comes from the request)
  course.workPosition = req.body.workPosition; // set the courses work position (comes from the request)
  course.excerpt = req.body.excerpt; // set the courses excerpt (comes from the request)
  course.content = req.body.content; // set the courses content (comes from the request)
  course.order = req.body.order; // set the courses order (comes from the
  course.image = req.body.image; // set the avatar image

  // save the course and check for errors
  course.save(function(err) {
    if (err) res.send(err);
    req.flash("success", `Successfully created ${course.name}`);
    res.redirect("/admin/courses");
  });
};
module.exports.deleteCourse = function(req, res) {
  Course.remove(
    {
      _id: req.params.id
    },
    function(err, course) {
      if (err) res.send(err);
      req.flash("success", `Successfully deleted ${course.name}`);
      res.redirect("/admin/courses");
    }
  );
};

module.exports.updateCourse = async function(req, res) {
  await Course.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash("success", `Successfully updated ${course.name}`);

  res.redirect("/admin/courses/edit/" + req.params.id);
};
