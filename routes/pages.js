const PagesController = require("../controllers/PagesController");

const express = require("express");
const router = express.Router();

// redirect from old dynamic on now static page
router.get("/jobcenter-aa", (req, res) => res.redirect("/jobcenter"))
router.get("/:slug", PagesController.getSinglePage);

module.exports = router
