require("dotenv").config({ path: __dirname + "/../.env" });
const Employee = require("../../models/employee");
const Location = require("../../models/location");

module.exports.fetchEmployees = async employeesFromPersonio => {
  // const activeEmployees = employeesFromPersonio.data.filter(employee => employee.attributes.status.value === 'active')
  const locations = await Location.find({});

  const employeeInstances = employeesFromPersonio.data.map(e => {
    console.log('e', e);
    
    if (e.attributes.office.value && e.attributes.first_name.value) {
      const employeeLocations = locations
        .filter(l => l.name === e.attributes.office.value.attributes.name)
        .map(e => e._id);
      return {
        name: `${e.attributes.first_name.value} ${
          e.attributes.last_name.value
        }`,
        locations: employeeLocations,
        position: e.attributes.position.value
      };
    }
  });

  await Employee.deleteMany({});
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
