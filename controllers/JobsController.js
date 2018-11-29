require("dotenv").config({ path: __dirname + "/../.env" });
const request = require("request");
const Job = require("../models/job");
const Location = require("../models/location");

module.exports.getJobs = async function(req, res) {
  try {
    let jobs = await Job.find({})
      .populate("locations")
      .sort("order")
      .exec();
    let locations = await Location.find({}).exec();

    res.render("jobsPublic", {
      jobs,
      locations
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getSingleJob = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    res.render(`job`, {
      job
    });
  } catch (err) {
    console.log(err);
  }
};
