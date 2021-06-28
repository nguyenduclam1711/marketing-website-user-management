var express = require("express");
var router = express.Router();
const usersValidation = require('../validation/users')
var UserController = require("../controllers/UserController");

router.get("/register", UserController.renderRegister);

router.get("/login", UserController.conditionalRenderLogin);

router.get("/verify/:token", UserController.verify);

router.post("/register", usersValidation.register, UserController.register);

router.post("/login", UserController.login);
router.get("/logout", UserController.logout);

module.exports = router;
