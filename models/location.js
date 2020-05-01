const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  street: {
    type: String
  },
  email: {
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
  phone: {
    type: String
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
});

module.exports = mongoose.model("Location", LocationSchema);
