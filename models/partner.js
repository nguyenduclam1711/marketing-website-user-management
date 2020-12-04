const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const PartnerSchema = new Schema({
  title: String,
  link: String,
  order: Number,
  partnerlogo: {
    type: String
  },
  testimonial_name: String,
  testimonial_content: String,
  testimonial_job: String,
  testimonial_show: Boolean,
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Partner", PartnerSchema);
