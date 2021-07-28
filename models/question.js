var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  model: Object,
  active: Boolean,
  sendaltemail: Boolean,
  renderselector: String
});

module.exports = mongoose.model("Question", QuestionSchema);
