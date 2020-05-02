const express = require("express");
const router = express.Router();
const AdminLocationsController = require('../../controllers/admin/AdminLocationsController')
const { ensureAuthenticated, redirectNonAdmin } = require("../../helpers/helper");

router.get("/",
    ensureAuthenticated,
    redirectNonAdmin,
    AdminLocationsController.getLocations);

router.get("/:id",
    ensureAuthenticated,
    redirectNonAdmin,
    AdminLocationsController.getSingleLocation);

router.get("/edit/:id",
    ensureAuthenticated,
    redirectNonAdmin,
    AdminLocationsController.editLocation);

router.post("/",
    ensureAuthenticated,
    redirectNonAdmin,
    AdminLocationsController.uploadImages,
    AdminLocationsController.resizeImages,
    AdminLocationsController.createLocation);

router.delete("/delete/:id",
    ensureAuthenticated,
    redirectNonAdmin,
    AdminLocationsController.deleteLocation);

router.put("/update/:id",
    ensureAuthenticated,
    redirectNonAdmin,
    AdminLocationsController.uploadImages,
    AdminLocationsController.resizeImages,
    AdminLocationsController.updateLocation);

module.exports = router;
