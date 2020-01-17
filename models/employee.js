var mongoose = require("mongoose"),
  URLSlugs = require("mongoose-url-slugs"),
  Schema = mongoose.Schema;
var validateEmail = function (email) {
  console.debug(email)
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};
var EmployeeSchema = new Schema({
  name: String,
  avatar: {
    type: String
  },
  locations: [{type: Schema.ObjectId, ref: "Location"}],
  position: String,
  content: String,
  active: String,
  contact_user: {
    type: Boolean,
    unique: true,
    default: false
  },
  phone: {
    type: Number,
    default: undefined
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  language: {type: Schema.ObjectId, ref: "Language"},
  languageVersion: {type: Schema.ObjectId, ref: "Employee"}
});
EmployeeSchema.pre("save", function preSave(next) {
  const employee = this;
  employee.update({updatedAt: Date.now()});
  next();
});

EmployeeSchema.plugin(URLSlugs("name"));
EmployeeSchema.pre("remove", function (next) {
  if (!!this.languageVersion) {
    this.languageVersion.update({$unset: {language: 1, languageVersion: 1}}, next);
  } else {
    next();
  }
});
module.exports = mongoose.model("Employee", EmployeeSchema);
