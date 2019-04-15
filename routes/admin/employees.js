const AdminEmployeesController = require("../../controllers/admin/AdminEmployeesController");

const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  redirectNonAdmin
} = require("../../helpers/helper");

router.get(
  "/",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminEmployeesController.getEmployees
);
router.post(
  "/",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminEmployeesController.uploadImages,
  AdminEmployeesController.resizeImages,
  AdminEmployeesController.createEmployee
);
router.get(
  "/edit/:id",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminEmployeesController.editEmployee
);
router.put(
  "/update/:id",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminEmployeesController.uploadImages,
  AdminEmployeesController.resizeImages,
  AdminEmployeesController.updateEmployee
);

router.delete(
  "/delete/:id",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminEmployeesController.deleteEmployee
);

module.exports = router;
