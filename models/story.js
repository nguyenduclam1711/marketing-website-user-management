var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  URLSlugs = require('mongoose-url-slugs');

var StorySchema = new Schema({
  categories: [{ type: Schema.ObjectId, ref: "Category" }],
  title: String,
  alumniName: String,
  workPosition: String,
  excerpt: String,
  content: String,
  order: Number,
  image: String
});

StorySchema.plugin(URLSlugs('title'));
module.exports = mongoose.model("Story", StorySchema);
