var Tweet = require('./../models/tweets');
var mongoose 	= require('mongoose');
var Geo = require('./../models/geo');
var path = require('path');
var Trend = require('./../models/trend');
var Sentiment=require('./../models/senti');
var port = process.env.PORT || 8080;       
var SNSClient = require('aws-snsclient');


module.exports = function(app,io) {
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

    app.post('/receive', function(req,res) {
        console.log('sns notification received');
        var client = SNSClient(function(err, message) {
            console.log(typeof(message));
            io.sockets.emit('sentiment', {m:message}); 
            console.log(message);
        });
        client(req,res);

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
    
     app.get('/api/getSenti/:category',function(req,res) {
        Sentiment.find({category : req.params.category},{},function(err,data){
            if(err){
                res.send(err);
            }
            res.json(data);
        });
     });

    
    app.get('/api/getTrends/',function(req,res) {
        Trend.find({},{},function(err,data){
            if(err){
                res.send(err);
            }
            res.json(data);
        });


    });
    //For all others serve the html page
    app.get('/',function(req,res,next){    
        res.sendFile("index.html",{ root: path.join(__dirname, '/../../public/dashboard') });
    });
        
};