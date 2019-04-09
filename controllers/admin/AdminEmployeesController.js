require("dotenv").config({ path: __dirname + "/../.env" });
const Employee = require("../../models/employee");
const Location = require("../../models/location");

module.exports.getEmployee = async (req, res) => {
  const employeesByLocation = await fetchEmployeeByLocation()

  res.render("admin/employees", {
    employeesByLocation
  });
};
module.exports.getEmployeeByLocation = async (req, res) => {
  let location = await Location.findOne({
    name: { $regex: new RegExp(req.params.location, "i") }
  });

  let employees = await Employee.find({ location: location._id });

  res.render("admin/employeeslocation", {
    employees
  });
};

module.exports.fetchEmployees = async (employeesFromPersonio) => {
  const activeEmployees = employeesFromPersonio.data.filter(employee => employee.attributes.status.value === 'active')
  const locations = await Location.find({});

  const employeeInstances = activeEmployees.map(e => {
    const employeeLocations = locations.filter(l => l.name === e.attributes.office.value.attributes.name).map(e => e._id);
    return {
      name: `${e.attributes.first_name.value} ${e.attributes.last_name.value}`,
      locations: employeeLocations,
      department: e.attributes.department.value.attributes.name
    }
  })

  const result = await Employee.deleteMany({});
  await Employee.insertMany(employeeInstances);
};

module.exports.deleteemployees = async (req, res) => {
  try {
    Employee.collection.drop();
    res.redirect("/admin/employees?alert=created");
  } catch (err) {
    console.log(err);
    res.redirect("/admin/employees?alert=created");
  }
};
