var mongoose     = require('mongoose')
var Schema       = mongoose.Schema;

var GeoSchema   = new Schema({
            twid : String,
            geoType : String,
            geoCoordinates : Array,
            category : String
          
            });

module.exports = Geo = mongoose.model('Geo', GeoSchema);