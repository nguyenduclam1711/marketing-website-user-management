const Category = require("../../models/category");
const Page = require("../../models/page");

const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../../helpers/passport')

const AdminPagesController = require("../../controllers/admin/AdminPagesController");
router.get("/", ensureAuthenticated, AdminPagesController.getPages);

router.get("/:slug", ensureAuthenticated, AdminPagesController.getSinglePage);

router.get("/edit/:slug", ensureAuthenticated, AdminPagesController.editPage);

router.post("/", ensureAuthenticated, AdminPagesController.createPage);

router.delete("/delete/:slug", ensureAuthenticated, AdminPagesController.deletePage);
router.put("/update/:slug", ensureAuthenticated, AdminPagesController.updatePage);
module.exports = router;
