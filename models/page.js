var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  URLSlugs = require('mongoose-url-slugs');

var PageSchema = new Schema({
  title: String,
  content: String,
  order: Number,
  categories: [{ type: Schema.ObjectId, ref: "Category" }]
});

PageSchema.plugin(URLSlugs('title'));
module.exports = mongoose.model("Page", PageSchema);
