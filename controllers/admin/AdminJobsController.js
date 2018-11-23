require('dotenv').config({ path: __dirname + '/../.env' });
const request = require("request");
const Job = require("../../models/job");
const Location = require("../../models/location");

module.exports.getJobs = async function (req, res) {
  let jobs = await Job.find({})
    .populate("locations")
    .sort("order")
    .exec();
  let locations = await Location.find({})
    .exec();

  res.render("admin/jobs", {
    jobs,
    locations,
    message: res.locals.message,
    color: res.locals.color
  });
}

module.exports.getSingleJob = function (req, res) {
  Job.findById(req.params.id, function (err, job) {
    res.render("job", {
      job: job,
    });
  });
}
module.exports.editJob = async function (req, res) {

  Job.findById(req.params.id, async function (err, job) {
    let alllocations = await Location.find({}).exec();
    all = alllocations.map(loc => {
      let match = job.locations
        .map(pcat => pcat.toString())
        .includes(loc._id.toString());

      if (match) {
        return Object.assign({ selected: true }, loc._doc);
      } else {
        return loc._doc;
      }
    });
    let locations = await Location.find({})
      .exec();
    res.render("admin/editJob", {
      locations: all,
      job,
      message: res.locals.message,
      color: res.locals.color
    });
  });
}
module.exports.createJob = function (req, res) {
  var job = new Job(); 
  console.log('body', req.body);
  job.name = req.body.name; 
  job.content = req.body.content; 
  job.locations = req.body.locations;
  job.save(function (err) {
    if (err) res.send(err);
    console.log("Job created:", job);
    res.redirect("/admin/jobs?alert=created");
  });
}
module.exports.deleteJob = function (req, res) {
  Job.remove( { _id: req.params.id },
    function (err, job) {
      if (err) res.send(err);

      console.log("Job deleted");
      res.redirect("/admin/jobs?alert=deleted");
    }
  );
}
module.exports.updateJob = function (req, res) {
  Job.findById(req.params.id, function (err, job) {
    if (err) res.send(err);

    job.name = req.body.name;
    job.content = req.body.content;
    job.locations = req.body.locations;

    job.save(function (err) {
      if (err) res.send(err);

      console.log("Job updated:", job);
      res.redirect("/admin/jobs/edit/" + job._id + "?alert=updated");
    });
  });
}
