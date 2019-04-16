require("dotenv").config({ path: __dirname + "/../.env" });
const request = require("request");
const { promisify } = require("util");
const promisifiedRequest = promisify(request);
const Job = require("../../models/job");
const Location = require("../../models/location");
const parser = require("xml2json");

module.exports.fetchJobs = async (req, res) => {
  try {
    return new Promise(async (resolve, reject) => {
      const xml = await promisifiedRequest(
        "https://dci-jobs.personio.de/xml"
      );
      const jobsResponse = JSON.parse(parser.toJson(xml.body));
      const allJobs = jobsResponse["workzag-jobs"].position;
      await Job.deleteMany();

      for (let job of allJobs) {
        try {
          let location = await Location.findOne({
            name: { $regex: new RegExp(job.office, "i") }
          });
          if (!location) {
            location = new Location({
              name: job.office
            });
            location = await location.save();
          }

          const newjob = new Job({
            personio_id: job.id,
            locations: [location.id],
            name: job.name,
            description: job.jobDescriptions.jobDescription,
            department: job.department,
            employmentType: job.employmentType,
            schedule: job.schedule,
            seniority: job.seniority
          });
          await newjob.save();
        } catch (err) {
          console.log(err);
          reject("Jobs cronjob dont fetched");
        }
      }
      resolve("Jobs cronjob fetched");
      if (res) {
        res.redirect("/admin/jobs?alert=created");
      }
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getJobs = async (req, res) => {
  try {
    let jobs = await Job.find({})
      .populate("locations")
      .sort("order")
      .exec();

    let locations = await Location.find({}).exec();

    res.render("admin/jobs", {
      jobs,
      locations,
      query: req.query
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteJobs = async (req, res) => {
  try {
    Job.collection.drop();
    res.redirect("/admin/jobs?alert=created");
  } catch (err) {
    console.log(err);
    res.redirect("/admin/jobs?alert=created");
  }
};
