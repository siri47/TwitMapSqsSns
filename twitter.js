var twitt = require('twit'),
	twitter = new twitt({
		consumer_key: 'w6hHJEscClitn7VNY59n086Wk',
		consumer_secret: 'IpGHYeSghW7YOkYHg1fhr8nau0uNoIi70nRByeaKfh0121m7zm',
		access_token: '218786916-aW57bL8LW2JkS3psB5ChOH8j6xC7dO6LQOID11oU',	
		access_token_secret: '4YdgpQ7Xdabsk42mQNDTrqkVbnyltoQjHUgIPGaKJJK93'
	});


var stream = twitter.stream('statuses/filter', {track: 'sports'})
stream.on('tweet', function(tweet){
        if (tweet.geo!=null) {
            console.log(tweet);
            tweet.save(function(err) {
                if (!err) {
                    // If everything is cool, socket.io emits the tweet.
                    console.log("nope");
                    }
        }
	});