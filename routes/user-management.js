const express = require("express");
const router = express.Router();
const UserManagementController = require("../controllers/UserManagementController");

router.get('/', UserManagementController.renderUserMangement);

module.exports = router;
