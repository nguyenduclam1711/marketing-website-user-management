const Location = require("../../models/location");
const path = require("path");
const Employee = require("../../models/employee");
const Language = require("../../models/language");
const multer = require("multer");
const fs = require("fs");
const jimp = require("jimp");
const uuid = require("uuid");
const employee = require("../../models/employee");
module.exports.getLocations = async (req, res) => {
  const enReq = await Language.findOne({ title: 'en' })
  const employeesReq = Employee.find({language: enReq._id})
  const locationsReq = Location.find({})
    .populate('contactEmployee')
    .sort({ order: 1 })
    .exec();
  const [employees, locations] = await Promise.all([employeesReq, locationsReq])
  res.render("admin/locations", {
    locations,
    employees
  });
}

module.exports.getSingleLocation = (req, res) => {
  Location.findById(req.params.id, (err, location) => {
    res.render("location", {
      location: location
    });
  });
}

module.exports.editLocation = async (req, res) => {
  const enReq = await Language.findOne({ title: 'en' })
  const employeesReq = Employee.find({language: enReq._id})
  const locationReq = Location.findById(req.params.id)
    .populate('contactEmployee')
    .exec();
  const [employees, location] = await Promise.all([employeesReq, locationReq])
    
    res.render("admin/editLocation", {
      location,
      employees
    });
}

module.exports.createLocation = (req, res) => {
  var location = new Location();
  location.name = req.body.name; 
  location.street = req.body.street; 
  location.email = req.body.email; 
  location.order = req.body.order; 
  location.zip = req.body.zip; 
  location.avatar = req.body.avatar ? req.body.avatar : location.avatar;
  location.longitude = req.body.longitude; 
  location.latitude = req.body.latitude; 
  location.phone = req.body.phone; 
  location.contactEmployee = req.body.contactEmployee; 
  location.isCampus = req.body.isCampus === "on"; 
  location.save((err) => {
    if (err) res.send(err);
    req.flash("success", `Successfully created ${location.name}`);
    res.redirect("/admin/locations");
  });
}

module.exports.deleteLocation = (req, res) => {
  Location.remove(
    {
      _id: req.params.id
    },
    (err, location) => {
      if (err) res.send(err);

      req.flash("success", `Successfully deleted Location`);
      res.redirect("/admin/locations");
    }
  );
}

module.exports.updateLocation = (req, res) => {
  Location.findById(req.params.id, async (err, location) => {
    if (req.body.avatar && await fs.existsSync(path.resolve(process.env.IMAGE_UPLOAD_DIR, location.avatar))) {
      await fs.unlinkSync(path.resolve(process.env.IMAGE_UPLOAD_DIR, location.avatar));
    }
    if (err) { 
      console.log(err);
      res.send(err) 
      return;
    };
    location.name = req.body.name; 
    location.street = req.body.street; 
    location.email = req.body.email; 
    location.order = req.body.order; 
    location.zip = req.body.zip; 
    location.longitude = req.body.longitude; 
    location.latitude = req.body.latitude; 
    location.phone = req.body.phone; 
    location.contactEmployee = req.body.contactEmployee; 
    location.avatar = req.body.avatar ? req.body.avatar : location.avatar;
    location.isCampus = req.body.isCampus === "on"; 
    location.save((err) => {
      if (err) { 
        console.log(err);
        res.send(err) 
        return;
      };
      req.flash("success", `Successfully updated ${location.name}`);
      res.redirect("/admin/locations/edit/" + location._id);
    });
  });
}

const storage = multer.diskStorage({
  destination: function(request, file, next) {
    next(null, "./temp");
  },
  filename: function(request, file, next) {
    next(null, uuid(4));
  }
});

//TODO refactor all similar uploadImages and resizeImages implementations (courses, employees, locations, partners, stories) into abstract controller
module.exports.uploadImages = multer({
  storage,
  limits: {
    fileSize: 10000000 // 10 MB
  },
  fileFilter(req, file, next) {
    if (file.mimetype.startsWith("image/")) {
      next(null, true);
    } else {
      next({ message: "That filetype is not allowed!" }, false);
    }
  }
}).fields([
  { name: "avatar", maxCount: 1 }
]);

exports.resizeImages = async (request, response, next) => {
  if (!request.files) {
    next();
    return;
  }
  for await (const singleFile of Object.values(request.files)) {
    const extension = singleFile[0].mimetype.split("/")[1];
    request.body[singleFile[0].fieldname] = `${
      singleFile[0].filename
    }.${extension}`;
    try {
      const image = await jimp.read(singleFile[0].path);
      await image.cover(600, 600);
      await image.write(
        `${process.env.IMAGE_UPLOAD_DIR}/${
          request.body[singleFile[0].fieldname]
        }`
      );
      fs.unlinkSync(singleFile[0].path);
    } catch (error) {
      console.log(error);
    }
  }
  next();
};