const express = require("express");
const router = express.Router();
const { ensureAuthenticated, redirectNonAdmin } = require('../../helpers/helper')

const AdminSettingsController = require("../../controllers/admin/AdminSettingsController")
router.get("/", ensureAuthenticated, AdminSettingsController.getSettings);
router.post("/stringtranslations", ensureAuthenticated,  AdminSettingsController.createStringtranslation);
router.delete("/stringtranslations/delete/:id", ensureAuthenticated, AdminSettingsController.deleteStringtranslation);
router.put("/stringtranslations/update/:id", ensureAuthenticated, AdminSettingsController.updateStringtranslation);
module.exports = router;
