var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var JobSchema   = new Schema({
    name: String,
    locations: [{ type: Schema.ObjectId, ref: "Location" }],
    content: String,
    updatedAt: {
      type: Date,
      default: Date.now 
    },
    createdAt: {
      type: Date,
      default: Date.now 
    }
});

module.exports = mongoose.model('Job', JobSchema);
