require("dotenv").config({ path: __dirname + "/../.env" });
const Employee = require("../models/employee");

module.exports.getEmployees = async function(req, res) {
  try {
    let employees = await Employee.find({})
      .populate("locations")
      .sort("-createdAt")
      .exec();

    res.render("employees", {
      employees
    });
  } catch (err) {
    console.log(err);
  }
};
