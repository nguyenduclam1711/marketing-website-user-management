require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Story = require("../../models/story");
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const fs = require('fs');

// to catch the error if 'IMAGE_UPLOAD_DIR' path not exist in .env file
if(!process.env.IMAGE_UPLOAD_DIR) {
  console.error("IMAGE_UPLOAD_DIR MISSING")
  process.exit()
}

module.exports.getStories = async function (req, res) {
  //here we get the whole collection and sort by order
  let stories = await Story.find({})
    .sort("order")
    .exec();

  res.render("admin/stories", {
    stories: stories
 
  });
}


module.exports.getSingleStory = async (req, res) => {
  try {
    const story = await Story.findOne({ "slug": req.params.slug })
    res.render(`story`, {
      story
    });
  } catch (err) {
    console.log(err);
  }
}
module.exports.editStory = async function (req, res) {
  let stories = await Story.find({})
    .sort("order")
    .exec();
  const story = await Story.findOne({slug: req.params.slug})
  
  const shiftStoryBack = stories.length + 1

  res.render("admin/editStory", {
    story,
    maxOrder: shiftStoryBack
  });
}
module.exports.createStory = async (req, res) => {
  var story = new Story(); // create a new instance of the story model
  story.title = req.body.title; // set the stories title (comes from the request)
  story.alumniName = req.body.alumniName; // set the stories alumni name (comes from the request)
  story.workPosition = req.body.workPosition; // set the stories work position (comes from the request)
  story.excerpt = req.body.excerpt; // set the stories excerpt (comes from the request)
  story.content = req.body.content; // set the stories content (comes from the request)
  story.order = req.body.order; // set the stories order (comes from the
  story.image = req.body.image; // set the avatar image

  // save the story and check for errors
  story.save(function (err) {
    if (err) res.send(err);
    req.flash("success", `Successfully created ${story.title}`);    
    res.redirect("/admin/stories");
  });
}
module.exports.deleteStory = async (req, res) => {
  try {
    await Story.remove({ slug: req.params.slug})
    req.flash("success", `Successfully deleted ${story.name}`);
    res.redirect("/admin/stories");
  } catch (err) {
    console.log(err);
  }
}

module.exports.updateStory = async function (req, res) {
  // use our story model to find the story we want
  await Story.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true, runValidators: true }
  ).exec()

  req.flash("success", `Successfully updated ${story.name}`);
  res.redirect("/admin/stories/edit/" + req.params.slug);
}


// Storage settings for project images
const storage = multer.diskStorage({
  destination: function (request, file, next) {
    next(null, './temp')
  },
  filename: function (request, file, next) {
    next(null, uuid(4))
  }
})


// Handle the image upload and filter by type
module.exports.uploadImages = multer({
  storage,
  limits: {
    fileSize: 10000000 // 10 MB
  },
  fileFilter(req, file, next) {
    if (file.mimetype.startsWith('image/')) {
      next(null, true)
    } else {
      next({ message: 'That filetype is not allowed!' }, false)
    }
  }
})
  .single("avatar")

// Resize the images with different thumbnail sizes
exports.resizeImages = async (request, response, next) => {
  if (!request.file) {
    next()
    return
  }

  const extension = request.file.mimetype.split('/')[1]
  request.body.image = `${uuid.v4()}.${extension}`

  try {
    const image = await jimp.read(request.file.path)
    await image.cover(350, 180)
    await image.write(`${process.env.IMAGE_UPLOAD_DIR}${request.body.image}`)
    fs.unlinkSync(request.file.path)
  } catch (error) {
    console.log(error);
  }
  next()
}

// Validate profile data and save
exports.updateProfile = async (request, response) => {
  await User.findOneAndUpdate(
    { _id: request.story.slug },
    request.body,
    {
      new: true,
      runValidators: true
    }
  ).exec()

  response.redirect('/admin/stories/edit' + story.slug)
}
