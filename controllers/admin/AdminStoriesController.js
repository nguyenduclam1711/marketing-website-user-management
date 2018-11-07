require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const request = require("request");
const Category = require("../../models/category");
const Story = require("../../models/story");
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const fs = require('fs');

module.exports.getStories = async function (req, res) {
  //here we get the whole collection and sort by order
  let stories = await Story.find({})
    .sort("order")
    .exec();
  let categories = await Category.find({}).exec();

  res.render("admin/stories", {
    stories: stories,
    categories: categories,
    message: res.locals.message,
    color: res.locals.color
  });
}


module.exports.getSingleStory = function (req, res) {
  Story.findById(req.params.id, function (err, story) {
    res.render("story", {
      story: story,
    });
  });
}
module.exports.editStory = async function (req, res) {
  let stories = await Story.find({})
    .sort("order")
    .exec();
  Story.findById(req.params.id, async function (err, story) {
    let allcategories = await Category.find({}).exec();
    all = allcategories.map(cat => {
      let match = story.categories
        .map(pcat => pcat.toString())
        .includes(cat._id.toString());

      if (match) {
        return Object.assign({ selected: true }, cat._doc);
      } else {
        return cat._doc;
      }
    });
    console.log('#####', stories.length);
    const shiftStoryBack = stories.length + 1

    res.render("admin/editStory", {
      story: story,
      maxOrder: shiftStoryBack,
      categories: all,
      message: res.locals.message,
      color: res.locals.color
    });
  });
}
module.exports.createStory = function (req, res) {
  var story = new Story(); // create a new instance of the story model
  story.name = req.body.name; // set the stories name (comes from the request)
  story.content = req.body.content; // set the stories name (comes from the request)
  story.order = req.body.order; // set the stories name (comes from the
  story.image = req.body.image; // set the avatar image
  story._categories = req.body.categories; // set the stories name (comes from the

  // save the story and check for errors
  story.save(function (err) {
    if (err) res.send(err);
    console.log("Story created:", story);
    res.redirect("/admin/stories?alert=created");
  });
}
module.exports.deleteStory = function (req, res) {
  Story.remove(
    {
      _id: req.params.id
    },
    function (err, story) {
      if (err) res.send(err);

      console.log("Story deleted");
      res.redirect("/admin/stories?alert=deleted");
    }
  );
}

module.exports.updateStory = async function (req, res) {
  // use our story model to find the story we want
  await Story.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  ).exec()

  res.redirect("/admin/stories/edit/" + req.params.id + "?alert=updated");
  /*
    Story.findById(req.params.id, function (err, story) {
      if (err) res.send(err);
  
      story.name = req.body.name; // update the stories info
      story.content = req.body.content; // update the stories info
      story.order = req.body.order; // update the stories info
      story.categories = req.body.categories;
      story.image = req.body.image;
  
      // save the story
      story.save(function (err) {
        if (err) res.send(err);
  
        console.log("Story updated:", story);
        res.redirect("/admin/stories/edit/" + story._id + "?alert=updated");
      });
    });
    */
}


const imageUploadDir = './uploads/images/'

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
    await image.write(`${imageUploadDir}${request.body.image}`)
    fs.unlinkSync(request.file.path)
  } catch (error) {
    console.log(error);
  }

  next()
}

// Validate profile data and save
exports.updateProfile = async (request, response) => {
  console.log(request.body);

  await User.findOneAndUpdate(
    { _id: request.story._id },
    request.body,
    {
      new: true,
      runValidators: true
    }
  ).exec()

  console.log('success', `Successfully updated your profile.`)
  response.redirect('/admin/stories/edit' + story._id + "?alert=updated")
}