var Tweet = require('./../models/tweets');
var mongoose 	= require('mongoose');
var Geo = require('./../models/geo');



module.exports = function(app) {
    //All my api
    app.get('/api/getTweets', function(req, res) {
        //console.log(Bear);
        
        Tweet.find({}, function(err,data) {
            
            if (err) {
					res.send(err);
				}
				res.json(data);
        });
        

    });
    
    app.post('/api/insertTweet', function(req,res) {
       console.log(req.body.title);
       console.log(req.body.title);
        Tweet.create(req.body,function(err,data) {
            console.log('reached inside');
            if (err) {
					res.send(err);
				}
				res.json(data);
        });
    });




    //All my api
    app.get('/api/getRecentTweets/:seconds', function(req, res) {
        //console.log(Bear);
        
        Tweet.find({}, function(err,data) {
            
            if (err) {
					res.send(err);
				}
				res.json(data);
        });
    });

    //All my api
    app.get('/api/getAllTweets/:category', function(req, res) {
        
        Tweet.find({category : req.params.category}, {}, function(err,data) {
            
            if (err) {
					res.send(err);
				}
				res.json(data);
        });
    });
    
    //For all others serve the html page
app.get('/',function(req,res,next){    res.sendFile("/Users/kavyapremkumar/Documents/TwitMap/public/chk.html");
    });
    
};