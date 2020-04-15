var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  name: String,
  locations: [{ type: Schema.ObjectId, ref: "Location" }],
  email: String,
  phone: String,
  track: String,
  body: String,
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  utm_content: String,
  utm_term: String,
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isCompany: String
});

module.exports = mongoose.model("Contact", ContactSchema);
