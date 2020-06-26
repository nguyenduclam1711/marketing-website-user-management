const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  redirectNonSuperAdmin
} = require("../../helpers/helper");

const AdminUsersController = require("../../controllers/admin/AdminUsersController");

router.get(
  "/",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminUsersController.getUsers
);

router.post(
  "/upgrade_user/:id",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminUsersController.upgradeUser
);

router.get(
  "/verify_user/:id",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminUsersController.verifyUser
);

router.post(
  "/delete/:id",
  ensureAuthenticated,
  redirectNonSuperAdmin,
  AdminUsersController.deleteUser
);
  
module.exports = router;
