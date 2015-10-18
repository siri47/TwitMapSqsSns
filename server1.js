var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

//Setup twitter stream api
var twit = new twitter({
  consumer_key: 'w6hHJEscClitn7VNY59n086Wk',
  consumer_secret: 'IpGHYeSghW7YOkYHg1fhr8nau0uNoIi70nRByeaKfh0121m7zm',
  access_token_key: '218786916-aW57bL8LW2JkS3psB5ChOH8j6xC7dO6LQOID11oU',
  access_token_secret: '4YdgpQ7Xdabsk42mQNDTrqkVbnyltoQjHUgIPGaKJJK93'
}),
stream = null;

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8080);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res,next){
    res.sendFile(__dirname+'/public/sample2.html');
});


//Create web sockets connection.
io.sockets.on('connection', function (socket) {
    
socket.on("start tweets", function() {

    if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.
      twit.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(stream) {
          stream.on('data', function(data) {
              // Does the JSON result have coordinates
              if (data.coordinates){
                if (data.coordinates !== null){
                  //If so then build up some nice json and send out to web sockets
                  var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};

                  socket.broadcast.emit("twitter-stream", outputPoint);

                  //Send out to web sockets channel.
                  socket.emit('twitter-stream', outputPoint);
                }
                else if(data.place){
                  if(data.place.bounding_box === 'Polygon'){
                    // Calculate the center of the bounding box for the tweet
                    var coord, _i, _len;
                    var centerLat = 0;
                    var centerLng = 0;

                    for (_i = 0, _len = coords.length; _i < _len; _i++) {
                      coord = coords[_i];
                      centerLat += coord[0];
                      centerLng += coord[1];
                    }
                    centerLat = centerLat / coords.length;
                    centerLng = centerLng / coords.length;

                    // Build json object and broadcast it
                    var outputPoint = {"lat": centerLat,"lng": centerLng};
                    socket.broadcast.emit("twitter-stream", outputPoint);

                  }
                }
              }
              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });
          });
      });
    }
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});