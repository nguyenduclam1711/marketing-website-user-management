const Course = require("../../models/course");

const express = require("express");
const router = express.Router();
const { ensureAuthenticated, redirectNonAdmin } = require("../../helpers/passport");

const AdminCoursesController = require("../../controllers/admin/AdminCoursesController");
router.get("/", ensureAuthenticated, redirectNonAdmin, AdminCoursesController.getCourses);

router.get(
  "/:slug",
  ensureAuthenticated, redirectNonAdmin,
  AdminCoursesController.getSingleCourse
);

router.get(
  "/edit/:slug",
  ensureAuthenticated, redirectNonAdmin,
  AdminCoursesController.editCourse
);

router.post(
  "/",
  ensureAuthenticated, redirectNonAdmin,
  AdminCoursesController.uploadImages,
  AdminCoursesController.resizeImages,
  AdminCoursesController.createCourse
);

router.delete(
  "/delete/:slug",
  ensureAuthenticated, redirectNonAdmin,
  AdminCoursesController.deleteCourse
);
router.put(
  "/update/:slug",
  ensureAuthenticated, redirectNonAdmin,
  AdminCoursesController.uploadImages,
  AdminCoursesController.resizeImages,
  AdminCoursesController.updateCourse
);
module.exports = router;
