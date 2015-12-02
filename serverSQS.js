// server.js

// BASE SETUP
// =============================================================================

var express    = require('express');        // call express
var app        = express();         // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var http = require('http');
var aws = require( "aws-sdk" );
var Q = require( "q" );
var chalk = require( "chalk" );
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;        // set our port
var database = require('./app/config/database');
var db = mongoose.connect(database.url);	
var AlchemyAPI = require('./app/alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();

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
require('./app/routes/routes.js')(app,io);
var category=undefined;

sportsBag=['sports', 'football', 'sport', 'volleyball', 'basketball', 'cricket', 'golf', 'baseball', 'soccer', 'championship', 'manchester united', 'mufc', 'lpfc', 'badminton', 'olympics','wrestling', 'boxing', 'athletics', 'world cup', 'champions league', 'league', 'serie a', 'laliga', 'handball', 'liverpool', 'chelsea', 'arsenal', 'real madrid', 'atheletico madrid'];

technologyBag=['android', 'samsung', 'youtube', 'nexus', 'computer', 'science', 'device', 'phone', 'laptop', 'satellite','technology', 'nasa', 'rocket', 'microsoft', 'tablet', 'network', 'internet', 'google', 'database', 'big data', 'software', 'hardware', 'machine', 'data centre', 'data science', 'stephen hawkins','invention'];

moviesBag=['movie', 'movies', 'hollywood', 'kollywood', 'bollywood', 'hugh jackman', 'game of thrones', 'natalie portman', 'jennifer lawrence', 'jennifer aniston', 'kate winslet', 'leornado di caprio', 'grammy', 'oscar', 'hans jimmer', 'cinema', 'cinematography', 'christopher nolan', 'woody allen', 'trailer', 'action ', 'comedy', 'romcom', 'tragedy', 'tom hanks', 'jimmy fallon', 'tom cruise', 'snl', 'blockbuster', 'opening night', 'box office','theatre', 'musical'];

politicsBag=['politics', 'democracy', 'democrat','vote', 'campaign', 'governor', 'mayor', 'governance', 'debate', 'trump', 'obama', 'michelle obama', 'barrack obama', 'white house', 'election', 'political', 'republic', 'republican', 'congressmen', 'congress', 'modi', 'narendra modi', 'bernie', 'hillary', 'clinton', 'president', 'prime minister', 'minister', 'legislature', 'donald trump', 'democratic', 'government', 'parliament', 'federal', 'judiciary', 'communism', 'dictator', 'bureaucracy'];


//require('./twit.js')(db);
//---------------------

function runForCategory() {
var count={};
count["sports"]=25;
count["politics"]=25;
count["technology"]=25;
count["movie"]=25;
var t = require('./app/models/tweets');
var geoSpecific = require('./app/models/geo');
var Sentiment = require('./app/models/senti');
var Trends= require('./app/models/trend');
var twitt = require('twit'),
    
twitter = new twitt({consumer_key: 'w6hHJEscClitn7VNY59n086Wk',              consumer_secret:'IpGHYeSghW7YOkYHg1fhr8nau0uNoIi70nRByeaKfh0121m7zm',
access_token: '218786916-aW57bL8LW2JkS3psB5ChOH8j6xC7dO6LQOID11oU',	
access_token_secret: '4YdgpQ7Xdabsk42mQNDTrqkVbnyltoQjHUgIPGaKJJK93'
});
var stream = twitter.stream('statuses/filter', {'locations':'-180,-90,180,90'})
stream.on('tweet', function(tweet){
    var s1=0;
    var s2=0;
    var s3=0;
    var s4=0;
    var matches = [];
    
   // tweet.text=tweet.text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    /*var re = /(?:^|\W)#(\w+)(?!\w)/g, match, matches1 = '';
    while (match = re.exec(tweet.text)) {
        matches1+=' '+match[1]+' ';
    }*/
    
    for (i in sportsBag){
        if (tweet.text.toLowerCase().search(' '+sportsBag[i]+' ') >=0){
            s1=s1+1;
            matches.push(sportsBag[i]);
        }
    }
    for (i in moviesBag){
        if (tweet.text.toLowerCase().search(moviesBag[i])>=0){
            s2=s2+1;
            matches.push(moviesBag[i]);
        }
    }
    for (i in politicsBag){
        if (tweet.text.toLowerCase().search(politicsBag[i])>=0){
            s3=s3+1;
            matches.push(politicsBag[i]);
        }
    }
    for (i in technologyBag){
        if (tweet.text.toLowerCase().search(technologyBag[i])>=0){
            s4=s4+1;
            matches.push(technologyBag[i]);
        }
    }
    
    if (s1!=0 || s2!=0 || s3!=0 || s4!=0 ){
        if ( s1>=s2 && s1>=s3 && s1>=s4)
            category="sports";
        else if ( s2>=s1 && s2>=s3 && s2>=s4)
            category="movie";
        else if ( s3>=s1 && s3>=s2 && s3>=s4)
            category="politics";
        else
            category="technology";

        if (tweet.geo!=null){
                count[category]+=1;            
                tweet['category'] = category;
                tweet['timestamp'] = new Date();
                var data = {
                    twid : tweet['id'],
                    geoType : tweet['geo']['type'],
                    geoCoordinates : tweet['geo']['coordinates'],
                    category : category,
                    };
                    console.log(category," :  ",matches, " - ",tweet.text);
                    /*geoSpecific.create(data, function(err){
                    if(err){
                        console.log(err);
                    }                    
                });*/
                t.create(tweet, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            
// Create an instance of our SQS Client.
var sqs = new aws.SQS({
    region: 'us-east-1',//config.aws.region,
    accessKeyId: 'AKIAJ6SNL5URRAILJOKQ',//config.aws.accessID,
    secretAccessKey: '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',//config.aws.secretKey,

    // For every request in this demo, I'm going to be using the same QueueUrl; so,
    // rather than explicitly defining it on every request, I can set it here as the
    // default QueueUrl to be automatically appended to every request.
    params: {
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/202100215321/que1' 
        //config.aws.queueUrl
    }
});

// Proxy the appropriate SQS methods to ensure that they "unwrap" the common node.js
// error / callback pattern and return Promises. Promises are good and make it easier to
// handle sequential asynchronous data.
var sendMessage = Q.nbind( sqs.sendMessage, sqs );
//JS file to fetch messages from Queue
var checkMessage = require('./tryQ');

// ---------------------------------------------------------- //
// ---------------------------------------------------------- //


// Now that we have a Q-ified method, we can send the message.
sendMessage({
    MessageBody: tweet['text']
})
.then(
    function handleSendResolve( data ) {

        console.log( chalk.green( "Message sent:", data.MessageId ) );

    }
)

// Catch any error (or rejection) that took place during processing.
.catch(
    function handleReject( error ) {

        console.log( chalk.red( "Unexpected Error:", error.message ) );

    }
);

                var outputPoint = {"lat":tweet['geo']['coordinates']['0'],"lng": tweet['geo']['coordinates']['1']};
                io.sockets.emit('twitter-stream', {geo:outputPoint,cat:category}); 


            if(count[category]== 28){
                count[category]=0;
                getTweets(category);
            }
        }
    }
});

var tr=require('./newtrends.js');    
    
var Str='';
function getTweets(cat){
    console.log("getTweets"+ cat);
    t.find({category:cat},{},{limit : 200}, function(err,data) {  
    if (err) {
				console.log(err);
    }
    Str='';
    for ( i in data){ 
            Str=Str+' '+(data[i].toObject()['text']);
    }
            //console.log(Str);
    entities(Str,cat);
    });       
};

    
    
    
    
    
function entities(Str,cat){
    var output={};
    alchemyapi.sentiment('text', Str, {}, function(response) {
    output['sentiment'] = { text:Str, response:JSON.stringify(response,null,4), results:response['sentiment'] };
    console.log('========================================');
     //while(response == null || response === undefined );
    console.log(response['docSentiment']);  
    if( typeof(response['docSentiment']) === "undefined" )
    return;
    s=response['docSentiment']['type'];
    console.log(response['docSentiment']['type']);
        
    var dbval=
        {
            category : cat,
            senti : s
        };
    
    Sentiment.remove({'category':cat}, function(err){
        if(!err){
            console.log("success");
        }
    });
            Sentiment.create(dbval, function(err){
        if(err){
            console.log(err);
        }
            });
            
    
 //for
    });
};
};
          //  socket.emit('twitter-stream', {geo:outputPoint,cat:globalCategory});
//    socket.emit("connected");


    
runForCategory();
