const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../../helpers/helper')

const AdminStoriesController = require("../../controllers/admin/AdminStoriesController");
router.get("/", ensureAuthenticated, AdminStoriesController.getStories);

router.get("/:slug", ensureAuthenticated, AdminStoriesController.getSingleStory);

router.get("/edit/:slug", ensureAuthenticated, AdminStoriesController.editStory);

router.post("/", ensureAuthenticated, AdminStoriesController.uploadImages, AdminStoriesController.resizeImages, AdminStoriesController.createStory);

router.delete("/delete/:slug", ensureAuthenticated, AdminStoriesController.deleteStory);
router.put("/update/:slug", ensureAuthenticated, AdminStoriesController.uploadImages, AdminStoriesController.resizeImages, AdminStoriesController.updateStory);
module.exports = router;
