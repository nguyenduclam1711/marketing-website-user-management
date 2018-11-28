const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../../helpers/passport')

const AdminJobsController = require("../../controllers/admin/AdminJobsController");
router.get("/", ensureAuthenticated, AdminJobsController.getJobs);

router.get("/:id", ensureAuthenticated, AdminJobsController.getSingleJob);

router.get("/edit/:id", ensureAuthenticated, AdminJobsController.editJob);

router.post("/", ensureAuthenticated, AdminJobsController.createJob);

router.delete("/delete/:id", ensureAuthenticated, AdminJobsController.deleteJob);
router.put("/update/:id", ensureAuthenticated, AdminJobsController.updateJob);
module.exports = router;
