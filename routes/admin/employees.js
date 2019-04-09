const AdminEmployeesController = require("../../controllers/admin/AdminEmployeesController");

const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  redirectNonAdmin
} = require("../../helpers/helper");

router.get("/", AdminEmployeesController.getEmployees);
// router.get("/:id", ensureAuthenticated, redirectNonAdmin, AdminEmployeesController.getSingleEmployee);

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
  AdminEmployeesController.updateEmployee
);
router.get(
  "/deleteemployees",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminEmployeesController.deleteemployees
);
router.get(
  "/fetchemployees",
  ensureAuthenticated,
  redirectNonAdmin,
  AdminEmployeesController.fetchEmployees
);

module.exports = router;
