var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StorySchema = new Schema({
  categories: [{ type: Schema.ObjectId, ref: "Category" }],
  name: String,
  content: String,
  order: Number,
  image: String
});

module.exports = mongoose.model("Story", StorySchema);
