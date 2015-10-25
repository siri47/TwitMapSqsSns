// app/models/trend.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TrendSchema   = new Schema({},{ strict:false });

module.exports = trend = mongoose.model('trend', TrendSchema);