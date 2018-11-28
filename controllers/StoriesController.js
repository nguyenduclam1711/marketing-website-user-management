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
    stories,
    categories,
    message: res.locals.message,
    color: res.locals.color
  });
}


module.exports.getSingleStory = async (req, res) => {
  const story = await Story.findOne({ slug: req.params.id })
  res.render("story", {
    story
  });

}
