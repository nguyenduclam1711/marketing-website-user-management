const JobsController = require("../controllers/JobsController");

const express = require("express");
const router = express.Router();

router.get("/", JobsController.getJobs);
router.get("/:slug", JobsController.getSingleJob);

module.exports = router;
