const express = require("express");
const router = express.Router();
const { ensureAuthenticated, redirectNonAdmin } = require('../../helpers/helper')

const AdminJobsController = require("../../controllers/admin/AdminJobsController");
router.get('/', ensureAuthenticated, redirectNonAdmin, AdminJobsController.getJobs)
router.get('/fetchjobs', ensureAuthenticated, redirectNonAdmin, AdminJobsController.fetchJobs);
router.get('/deletejobs', ensureAuthenticated, redirectNonAdmin, AdminJobsController.deleteJobs);
module.exports = router;
