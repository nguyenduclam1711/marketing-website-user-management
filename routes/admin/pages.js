const express = require("express");
const router = express.Router();
const { ensureAuthenticated, redirectNonAdmin } = require('../../helpers/helper')

const AdminPagesController = require("../../controllers/admin/AdminPagesController");
router.get("/", ensureAuthenticated, redirectNonAdmin, AdminPagesController.getPages);

router.get("/:slug", ensureAuthenticated, redirectNonAdmin, AdminPagesController.getSinglePage);

router.get("/edit/:slug", ensureAuthenticated, redirectNonAdmin, AdminPagesController.editPage);

router.post("/", ensureAuthenticated, redirectNonAdmin, AdminPagesController.createPage);

router.delete("/delete/:slug", ensureAuthenticated, redirectNonAdmin, AdminPagesController.deletePage);
router.put("/update/:slug", ensureAuthenticated, redirectNonAdmin, AdminPagesController.updatePage);
module.exports = router;
