var mongoose   = require('mongoose');
var database = require('./app/config/database');
var db = mongoose.connect(database.url);	



var t = require('./app/models/tweets');
var geoSpecific = require('./app/models/geo');



var twitt = require('twit'),
    twitter = new twitt({
        consumer_key: 'w6hHJEscClitn7VNY59n086Wk',
        consumer_secret: 'IpGHYeSghW7YOkYHg1fhr8nau0uNoIi70nRByeaKfh0121m7zm',
        access_token: '218786916-aW57bL8LW2JkS3psB5ChOH8j6xC7dO6LQOID11oU',	
        access_token_secret: '4YdgpQ7Xdabsk42mQNDTrqkVbnyltoQjHUgIPGaKJJK93'
    });

//category = ['selfie','movies','sports'];
var stream = twitter.stream('statuses/filter', {track: 'sports'})
stream.on('tweet', function(tweet){
    console.log('Got tweet '+ category);
        if (tweet.geo!=null){
            tweet['category'] = sports;
            tweet['timestamp'] = new Date();

            var data = {
                twid : tweet['id'],
                geoType : tweet['geo']['type'],
                geoCoordinates : tweet['geo']['coordinates'],
                category : 'sports'
            };
            console.log('got tweet of category');
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
        }
});

/*
runForCategory('sports');
runForCategory('selfie');
runForCategory('movie');
runForCategory('trump'); */
console.log('running');
