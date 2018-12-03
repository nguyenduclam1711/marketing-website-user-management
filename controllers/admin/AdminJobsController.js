require('dotenv').config({ path: __dirname + '/../.env' });
const request = require("request");
const Job = require("../../models/job");
const Location = require("../../models/location");

module.exports.getJobs = async (req, res) => {
  try {
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

  } catch (err) {
    console.log(err);
  }
}

module.exports.getSingleJob = async (req, res) => {
  try {
    const job = await Job.findOne({ "slug": req.params.slug })
    res.render(`job`, {
      job
    });
  } catch (err) {
    console.log(err);
  }
}
module.exports.editJob = async (req, res) => {
  try {
    const job = await Job.findOne({ "slug": req.params.slug })
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
  } catch (err) {
    console.log(err);
  }
}
module.exports.createJob = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
}
module.exports.deleteJob = async (req, res) => {
  await Job.remove( { slug: req.params.slug })
  console.log("Job deleted");
  res.redirect("/admin/jobs?alert=deleted");
}
module.exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ "slug": req.params.slug })

    job.name = req.body.name;
    job.content = req.body.content;
    job.locations = req.body.locations;

    await job.save()
    console.log("Job updated:", job);
    res.redirect("/admin/jobs/edit/" + job.slug + "?alert=updated");
  } catch (err) {
    console.log(err);
  }
}
