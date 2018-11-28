const PagesController = require("../controllers/PagesController");

const express = require("express");
const router = express.Router();

router.get("/:slug", PagesController.getSinglePage);

module.exports = router
