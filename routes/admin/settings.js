const express = require("express");
const router = express.Router();
const {ensureAuthenticated, redirectNonSuperAdmin} = require('../../helpers/helper')

const AdminSettingsController = require("../../controllers/admin/AdminSettingsController")
router.get("/",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminSettingsController.getSettings);
router.post("/",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminSettingsController.createSetting);
router.post("/stringtranslations",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminSettingsController.createStringtranslation);
router.post("/stringtranslations/delete/:id",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminSettingsController.deleteStringtranslation);
router.post("/stringtranslations/update",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminSettingsController.updateStringtranslation);
router.get("/clearcache",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminSettingsController.clearCache);
module.exports = router;
