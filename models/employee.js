var mongoose = require("mongoose"),
  URLSlugs = require("mongoose-url-slugs"),
  Schema = mongoose.Schema;
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
    index: true,
    unique: true
  },
  phone: {
    type: String,
    default: undefined
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
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
  languageVersion: {type: Schema.ObjectId, ref: "Employee"},
  order: {
    type: Number,
    default: 99
  },
});
EmployeeSchema.pre("save", function preSave(next) {
  const employee = this;
  employee.update({updatedAt: Date.now()});
  next();
});
EmployeeSchema.index({
  contact_user: 1,
}, {
  unique: true,
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
