const express = require('express')
const router = express.Router()

const PartnersController = require('../../controllers/admin/AdminPartnersController');
const { ensureAuthenticated, redirectNonAdmin } = require("../../helpers/helper");

router.get("/", ensureAuthenticated, redirectNonAdmin, PartnersController.getPartners);

router.get(
  "/edit/:id",
  ensureAuthenticated, redirectNonAdmin,
  PartnersController.editPartner
);

router.post(
  "/",
  ensureAuthenticated, redirectNonAdmin,
  PartnersController.uploadImages,
  PartnersController.resizeImages,
  PartnersController.createPartner
);

router.delete(
  "/delete/:id",
  ensureAuthenticated, redirectNonAdmin,
  PartnersController.deletePartner
);
router.put(
  "/update/:id",
  ensureAuthenticated, redirectNonAdmin,
  PartnersController.uploadImages,
  PartnersController.resizeImages,
  PartnersController.updatePartner
);
module.exports = router;
