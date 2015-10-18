// app/models/tweets.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TweetSchema   = new Schema({},{ strict:false });

module.exports = Bear = mongoose.model('tweets', TweetSchema);