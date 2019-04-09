require("dotenv").config({ path: __dirname + "/../.env" });
const Employee = require("../../models/employee");
const Location = require("../../models/location");
const fetch = require("node-fetch");

module.exports.getEmployees = async function(req, res) {
  try {
    let employees = await Employee.find({})
      .populate("locations")
      .sort("-createdAt")
      .exec();

    res.render("admin/employees", {
      employees
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.fetchEmployees = async (req, res) => {
  // const activeEmployees = employeesFromPersonio.data.filter(employee => employee.attributes.status.value === 'active')

  if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
    const url = `https://api.personio.de/v1/auth`;
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    };
    try {
      return new Promise(async function(resolve, reject) {
        fetch(url, {
          method: "post",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(personioResponse => {
            if (personioResponse.error) {
              console.log(error);
            }
            const employeeUrl = `https://api.personio.de/v1/company/employees?token=${
              personioResponse.data.token
            }`;

            fetch(employeeUrl, {
              headers: { "Content-Type": "application/json" }
            })
              .then(res => res.json())
              .then(async employeesFromPersonio => {
                const locations = await Location.find({});

                const employeeInstances = employeesFromPersonio.data.map(e => {
                  if (e.attributes.office.value && e.attributes.first_name.value) {
                    const employeeLocations = locations
                      .filter(
                        l =>
                          l.name === e.attributes.office.value.attributes.name
                      )
                      .map(e => e._id);
                    return {
                      name: `${e.attributes.first_name.value} ${
                        e.attributes.last_name.value
                      }`,
                      active: false,
                      locations: employeeLocations,
                      position: e.attributes.position.value
                    };
                  }
                });

                await Employee.deleteMany({});
                await Employee.insertMany(employeeInstances);
                if (res) {
                  res.redirect("/admin/employees?alert=created");
                }
                resolve("Employees cronjob fetched");
              });
          })
          .catch(e => console.error(e));
      });
    } catch (err) {
      console.log(err);
      res.redirect("/admin/events?alert=created");
    }

    return team;
  } else {
    console.log(
      `No personio API credentials provided. process.env.CLIENT_ID process.env.CLIENT_SECRET must be declared in .env`
    );
  }
};

module.exports.editEmployee = async function(req, res) {
  const employee = await Employee.findById(req.params.id);

  let alllocations = await Location.find({}).exec();
  all = alllocations.map(loc => {
    let match = employee.locations
      .map(pcat => pcat.toString())
      .includes(loc._id.toString());

    if (match) {
      return Object.assign({ selected: true }, loc._doc);
    } else {
      return loc._doc;
    }
  });

  res.render("admin/editEmployee", {
    employee: employee,
    locations: all
  });
};
module.exports.updateEmployee = (req, res) => {
  console.log("employee", req.params.id);

  Employee.findById(req.params.id, (err, employee) => {
    if (err) console.error(err);

    employee.name = req.body.name;
    employee.position = req.body.position;
    employee.locations = req.body.locations;

    employee.save(err => {
      if (err) console.error(err);

      req.flash("success", `Successfully updated ${employee.name}`);
      res.redirect("/admin/employees/edit/" + employee._id);
    });
  });
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
