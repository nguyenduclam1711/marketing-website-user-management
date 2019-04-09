const EmployeeController = require("../controllers/EmployeesController");

const express = require("express");
const router = express.Router();

router.get("/", EmployeeController.getEmployees);

module.exports = router;
