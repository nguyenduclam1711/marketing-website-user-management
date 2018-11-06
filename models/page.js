var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PageSchema = new Schema({
  title: String,
  content: String,
  order: Number
});

module.exports = mongoose.model("Page", PageSchema);
