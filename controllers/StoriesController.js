require('dotenv').config({ path: __dirname + '/../.env' });
const Story = require("../models/story");

module.exports.getStories = async function(req, res) {
  let stories = await Story.find({})
    .sort("order")
    .exec();

  res.render("stories", {
    stories
  });
}


module.exports.getSingleStory = async (req, res) => {
  const story = await Story.findOne({ slug: req.params.id })
  if(story){
    res.render("story", {
      story
    });
  } else {
    res.redirect("/stories")
  }
}
