const AdminContactsController = require("../../controllers/admin/AdminContactsController");

const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  redirectNonAdmin,
  redirectNonSuperAdmin
} = require("../../helpers/helper");

router.get(
  "/",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminContactsController.getContacts
);
router.delete(
  "/delete/:id",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminContactsController.deleteContact
);
router.get(
  "/api-json",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminContactsController.getContactsJson
);

module.exports = router;
