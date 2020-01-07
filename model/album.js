var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artistID: {type: Schema.ObjectId, ref:'Artist'}
});

module.exports = mongoose.model('Album',albumSchema);