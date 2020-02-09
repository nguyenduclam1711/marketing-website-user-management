const express = require("express");
const router = express.Router();
const { ensureAuthenticated, redirectNonAdmin } = require('../../helpers/helper')

const AdminSettingsController = require("../../controllers/admin/AdminSettingsController")
router.get("/", ensureAuthenticated, AdminSettingsController.getSettings);
router.post("/", ensureAuthenticated,  AdminSettingsController.createSetting);
router.post("/stringtranslations", ensureAuthenticated,  AdminSettingsController.createStringtranslation);
router.post("/stringtranslations/delete/:id", ensureAuthenticated, AdminSettingsController.deleteStringtranslation);
router.post("/stringtranslations/update", ensureAuthenticated, AdminSettingsController.updateStringtranslation);
module.exports = router;
