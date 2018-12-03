var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  URLSlugs = require('mongoose-url-slugs');

var JobSchema   = new Schema({
  name: String,
  locations: [{ type: Schema.ObjectId, ref: "Location" }],
  content: String,
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
