var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  URLSlugs = require('mongoose-url-slugs');


var CourseSchema = new Schema({
  icon: {
    type: String
  },
  headline: {
    type: String,
    trim: true,
    required: 'Please enter a course name!'
  },
  subheading: {
    type: String,
    trim: true,
    required: 'Please enter a course content !'
  },  
  title: {
    type: String
  },
  subtitle: {
    type: String
  },
  locations: [{ type: Schema.ObjectId, ref: "Location" }],
  archivements: [
    {
      icon: String,
      description: String,
    }
  ],
  features: [
    {
      title: String,
      subtitle: String,
      icon: String
    }
  ],
  timeline: [{
    title: String,
    subtitle: String,
    time: String
  }],
});

CourseSchema.plugin(URLSlugs('headline'));
module.exports = mongoose.model("Course", CourseSchema);
