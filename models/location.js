const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  street: {
    type: String
  },
  zip: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  isCampus: {
    type: Boolean
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String
  },
  order: {
    type: Number,
    default: 99

  },
  contactEmployee: [{
    type: Schema.ObjectId,
    ref: "Employee"
  }]
});

module.exports = mongoose.model("Location", LocationSchema);
