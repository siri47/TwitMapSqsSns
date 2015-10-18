// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
//1. make client side nicer, get trending
//2. Get trends on servrer side - alchemy
//3. get 100MB od twitter feed
//4. Deploying on cloud
//5. Check why its not adding to db
//6. Check if marker points are getting added to heat map
//var twitter = require('ntwitter'),
//var streamHandler = require('./utils/streamHandler');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;        // set our port
var database = require('./app/config/database');
var db = mongoose.connect(database.url);	

//--------------
// START THE SERVER

server.listen(port);
console.log('Magic happens on port ' + port);
           
//configure app to use bodyParser()
//this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API
require('./app/routes/routes.js')(app);

//require('./twit.js')(db);
//---------------------

function runForCategory(category) {
    
var t = require('./app/models/tweets');
var geoSpecific = require('./app/models/geo');
var twitt = require('twit'),
twitter = new twitt({consumer_key: 'w6hHJEscClitn7VNY59n086Wk',               consumer_secret:'IpGHYeSghW7YOkYHg1fhr8nau0uNoIi70nRByeaKfh0121m7zm',
access_token: '218786916-aW57bL8LW2JkS3psB5ChOH8j6xC7dO6LQOID11oU',	
access_token_secret: '4YdgpQ7Xdabsk42mQNDTrqkVbnyltoQjHUgIPGaKJJK93'
});
console.log('Start streaming for ', category);
var stream = twitter.stream('statuses/filter', {track: category})
stream.on('tweet', function(tweet){
    if (tweet.geo!=null){
            tweet['category'] = category;
            tweet['timestamp'] = new Date();
            var data = {
                twid : tweet['id'],
                geoType : tweet['geo']['type'],
                geoCoordinates : tweet['geo']['coordinates'],
                category : category,
                };
                console.log('got tweet of '+category);
                geoSpecific.create(data, function(err){
                if(err){
                    console.log(err);
                }                    
            });
            t.create(tweet, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            
            var outputPoint = {"lat":tweet['geo']['coordinates']['0'],"lng": tweet['geo']['coordinates']['1']};
            io.sockets.emit('twitter-stream', {geo:outputPoint,cat:category}); 


    }
});
};
          //  socket.emit('twitter-stream', {geo:outputPoint,cat:globalCategory});
//    socket.emit("connected");



    
runForCategory('sports');
runForCategory('technology');
runForCategory('movie');
runForCategory('politics');
console.log('running');
