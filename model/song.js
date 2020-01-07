var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = Schema({
    number: Number,
    name: String,
    eduration: String,
    file: String,
    album: {type:Schema.ObjectId, ref:'Album'}
});

module.exports = mongoose.model('Song',songSchema);