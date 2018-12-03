const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../../helpers/passport')

const AdminJobsController = require("../../controllers/admin/AdminJobsController");
router.get("/", ensureAuthenticated, AdminJobsController.getJobs);

router.get("/:slug", ensureAuthenticated, AdminJobsController.getSingleJob);

router.get("/edit/:slug", ensureAuthenticated, AdminJobsController.editJob);

router.post("/", ensureAuthenticated, AdminJobsController.createJob);

router.delete("/delete/:slug", ensureAuthenticated, AdminJobsController.deleteJob);
router.put("/update/:slug", ensureAuthenticated, AdminJobsController.updateJob);
module.exports = router;
