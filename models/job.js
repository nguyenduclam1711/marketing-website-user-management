var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  URLSlugs = require('mongoose-url-slugs');

var JobSchema   = new Schema({
  name: String,
  locations: [{ type: Schema.ObjectId, ref: "Location" }],
  personio_id: String,
  description: [Object],
  department: String,
  employmentType: String,
  schedule: String,
  seniority: String,
  updatedAt: {
    type: Date,
    default: Date.now 
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
});
JobSchema.plugin(URLSlugs('name'));
module.exports = mongoose.model('Job', JobSchema);
