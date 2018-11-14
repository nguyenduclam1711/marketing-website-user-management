require('dotenv').config({ path: __dirname + '/../.env' });
const request = require("request");
const Category = require("../models/category");
const Story = require("../models/story");

module.exports.getStories = async function(req, res) {
  let stories = await Story.find({})
    .sort("order")
    .exec();
  let categories = await Category.find({}).exec();

  res.render("stories", {
    stories: stories,
    categories: categories,
    message: res.locals.message,
    color: res.locals.color
  });
}


module.exports.getSingleStory = function(req, res) {
  Story.findById(req.params.id, function(err, story) {
    res.render("story", {
      story: story
    });
  });
}
