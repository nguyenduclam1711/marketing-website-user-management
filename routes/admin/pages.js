const Category = require("../../models/category");
const Page = require("../../models/page");

const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../../helpers/passport')

const AdminPagesController = require("../../controllers/admin/AdminPagesController");
router.get("/", ensureAuthenticated, AdminPagesController.getPages);

router.get("/:id", ensureAuthenticated, AdminPagesController.getSinglePage);

router.get("/edit/:id", ensureAuthenticated, AdminPagesController.editPage);

router.post("/", ensureAuthenticated, AdminPagesController.createPage);

router.delete("/delete/:id", ensureAuthenticated, AdminPagesController.deletePage);
router.put("/update/:id", ensureAuthenticated, AdminPagesController.updatePage);
module.exports = router;
