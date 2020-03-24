const {
    check,
    body
} = require("express-validator/check");
const User = require("../models/user");



exports.register = [
    check("username")
    .isLength({
        min: 2,
        max: 255
    })
    .withMessage(
        "User name is reqired min length 2 charctars max length 255 charctars"
    )
    .trim(),
    check("email")
    .isEmail()
    .withMessage("Invalid Email")
    .normalizeEmail()
    .isLength({
        max: 255
    })
    .withMessage("Email max length 255")
    .custom((value, {
        req
    }) => {
        return User.findOne({
            email: value
        }).then(user => {
            if (user) {
                return Promise.reject("the user alrady exist");
            }
        });
    })
    .trim(),
    check("password")
    .isAlphanumeric()
    .withMessage("password accept numbers and text")
    .isLength({
        min: 5,
        max: 50
    })
    .withMessage("password min length 5 and max  length 50")
    .trim(),
    check("password2")
    .custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error("the password is not identical with Confirm Password");
        }
        return true;
    })
    .trim()
];