const express = require("express");
const router = express.Router();
const { ensureAuthenticated, redirectNonAdmin } = require('../../helpers/helper')

const AdminJobsController = require("../../controllers/admin/AdminJobsController");
router.get("/", ensureAuthenticated, redirectNonAdmin, AdminJobsController.getJobs);

router.get("/:slug", ensureAuthenticated, redirectNonAdmin, AdminJobsController.getSingleJob);

router.get("/edit/:slug", ensureAuthenticated, redirectNonAdmin, AdminJobsController.editJob);

router.post("/", ensureAuthenticated, redirectNonAdmin, AdminJobsController.createJob);

router.delete("/delete/:slug", ensureAuthenticated, redirectNonAdmin, AdminJobsController.deleteJob);
router.put("/update/:slug", ensureAuthenticated, redirectNonAdmin, AdminJobsController.updateJob);
module.exports = router;
