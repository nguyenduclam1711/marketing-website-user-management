require("dotenv").config({ path: __dirname + "/../.env" });
const request = require("request");
const { promisify } = require("util");
const promisifiedRequest = promisify(request);
const Job = require("../../models/job");
const Location = require("../../models/location");
const parser = require("xml2json");

let responses = [];
module.exports.fetchJobs = async (req, res) => {
  try {
    return new Promise(async (resolve, reject) => {
      await Job.deleteMany();
      const queryLangs = ["en", "de"];
      for (let queryLang of queryLangs) {
        const url = `https://dci-jobs.personio.de/xml${
          queryLang === "en" ? `?language=en` : ``
        }`;
        responses.push(promisifiedRequest(url));
      }
      const responseResult = await Promise.all(responses);
      const xml = responseResult
        .map(r => JSON.parse(parser.toJson(r.body)))
        .map(x => x["workzag-jobs"].position)
        .flat();

      for (let job of xml) {
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
          const existingJob = await Job.findOne({ personio_id: job.id });

          if (existingJob) {
            await Job.update(
              { personio_id: job.id},
              {"$push": { "description": job.jobDescriptions.jobDescription } }
            ).exec();
          } else {
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
          }
        } catch (err) {
          console.log(err);
          reject("👎 Jobs cronjob dont fetched");
        }
      }
      resolve("👍 Jobs cronjob fetched");
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
    await Job.collection.drop();
    res.redirect("/admin/jobs?alert=created");
  } catch (err) {
    console.log(err);
    res.redirect("/admin/jobs?alert=created");
  }
};
