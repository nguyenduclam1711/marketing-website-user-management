const Course = require("../../models/course");

const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../../helpers/passport')

const AdminCoursesController = require("../../controllers/admin/AdminCoursesController");
router.get("/", ensureAuthenticated, AdminCoursesController.getCourses);

router.get("/:id", ensureAuthenticated, AdminCoursesController.getSingleCourse);

router.get("/edit/:id", ensureAuthenticated, AdminCoursesController.editCourse);

router.post("/", ensureAuthenticated, AdminCoursesController.uploadImages, AdminCoursesController.resizeImages, AdminCoursesController.createCourse);

router.delete("/delete/:id", ensureAuthenticated, AdminCoursesController.deleteCourse);
router.put("/update/:id", ensureAuthenticated, AdminCoursesController.updateCourse);
module.exports = router;
