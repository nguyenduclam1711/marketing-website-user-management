require("dotenv").config({ path: __dirname + "/../.env" });
const Job = require("../../models/job");
const Location = require("../../models/location");

module.exports.getJobs = async (req, res) => {
  try {
    let jobs = await Job.find({})
      .populate("locations")
      .sort("order")
      .exec();
    let locations = await Location.find({}).exec();

    res.render("admin/jobs", {
      jobs,
      locations
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getSingleJob = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    res.render(`job`, {
      job
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.editJob = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
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

    res.render("admin/editJob", {
      title: "Home",
      locations: all,
      job
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.createJob = async (req, res) => {
  try {
    var job = new Job();
    job.name = req.body.name;
    job.content = req.body.content;
    job.locations = req.body.locations;
    job.save(function(err) {
      if (err) res.send(err);
      
      req.flash("success", `Successfully created ${job.name}`);
      res.redirect("/admin/jobs");
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.deleteJob = async (req, res) => {
  await Job.remove({ slug: req.params.slug });
  req.flash("warning", `Successfully deleted Job`);
  res.redirect("/admin/jobs");
};

module.exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    req.flash("success", `Successfully updated ${job.name}`);
    job.name = req.body.name;
    job.content = req.body.content;
    job.locations = req.body.locations;

    await job.save();
    res.redirect("/admin/jobs/edit/" + job.slug);
  } catch (err) {
    console.log(err);
  }
};
