const AdminMenulocationsController = require("../../controllers/admin/AdminMenulocationsController");

const express = require("express");
const router = express.Router();
const { ensureAuthenticated, redirectNonAdmin } = require('../../helpers/passport')

router.get("/", ensureAuthenticated, redirectNonAdmin, AdminMenulocationsController.getMenulocations);

router.get("/edit/:id", ensureAuthenticated, redirectNonAdmin, AdminMenulocationsController.editMenulocation);

router.post("/", ensureAuthenticated, redirectNonAdmin, AdminMenulocationsController.createMenulocation);

router.delete("/delete/:id", ensureAuthenticated, redirectNonAdmin, AdminMenulocationsController.deleteMenulocation);

router.put("/update/:id", ensureAuthenticated, redirectNonAdmin, AdminMenulocationsController.updateMenulocation);

module.exports = router;
