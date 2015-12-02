
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SentimentSchema   = new Schema({},{ strict:false });

module.exports = sentiment = mongoose.model('sentiment', SentimentSchema);