const PagesController = require("../controllers/PagesController");

const express = require("express");
const router = express.Router();

router.get("/:id", PagesController.getSinglePage);

module.exports = router
