var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var SettingSchema = new Schema({
  archivements_students: Number,
  archivements_courses: Number,
  archivements_tours: Number,
  archivements_locations: Number,
  number_events: Number,
  tourmailreceiver: String,
  mailreceiver: String,
});

module.exports = mongoose.model("Setting", SettingSchema);
