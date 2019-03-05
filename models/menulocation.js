var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MenulocationSchema   = new Schema({
    name: String,
});

module.exports = mongoose.model('Menulocation', MenulocationSchema);
