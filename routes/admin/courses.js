const Course = require("../../models/course");

const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../../helpers/passport')

const AdminCoursesController = require("../../controllers/admin/AdminCoursesController");
router.get("/", ensureAuthenticated, AdminCoursesController.getCourses);

router.get("/:slug", ensureAuthenticated, AdminCoursesController.getSingleCourse);

router.get("/edit/:slug", ensureAuthenticated, AdminCoursesController.editCourse);

router.post("/", ensureAuthenticated, AdminCoursesController.uploadImages, AdminCoursesController.resizeImages, AdminCoursesController.createCourse);

router.delete("/delete/:slug", ensureAuthenticated, AdminCoursesController.deleteCourse);
router.put("/update/:slug", ensureAuthenticated, AdminCoursesController.updateCourse);
module.exports = router;
