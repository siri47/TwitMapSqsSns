// server.js

// BASE SETUP
// =============================================================================

var express    = require('express');        // call express
var app        = express();         // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var http = require('http');
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
require('./app/routes/routes.js')(app);
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
var Trend = require('./app/models/trend');
var twitt = require('twit'),
twitter = new twitt({consumer_key: 'w6hHJEscClitn7VNY59n086Wk',               consumer_secret:'IpGHYeSghW7YOkYHg1fhr8nau0uNoIi70nRByeaKfh0121m7zm',
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

                var outputPoint = {"lat":tweet['geo']['coordinates']['0'],"lng": tweet['geo']['coordinates']['1']};
                io.sockets.emit('twitter-stream', {geo:outputPoint,cat:category}); 

            if(count[category]== 30){
                count[category]=0;
                getTweets(category);
            }
        }
    }
});

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
    //Str=Str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	alchemyapi.entities('text', Str,{ 'sentiment':1 },           function(response) {
        console.log('========================================');
        console.log(response);
    output['entities'] = { text:Str,    response:JSON.stringify(response,null,5),               results:response['entities'] };
    if (typeof(response['entities'])==="undefined" || response['entities'].length == 0){
            console.log('------------------------------');
            console.log(response);
                return;
    }
    console.log(response['entities']);
    response['entities'].sort(function(a, b) {
        return parseFloat(b.count) - parseFloat(a.count);
    });
    for (j=0 ; j<5 && j<response["entities"].length; j++){
        console.log("=====",j);
        var s='';
        //if(response['entities'][j]['type']!='City'){
        //console.log(response['entities'][j]['text']);//}  
  if (typeof(response['entities'][j]['sentiment'])==="undefined"){
                 s="neutral";
             }
                else{
                s = response['entities'][j]['sentiment']['type'];
                }
            
        var dbVal =
             {
                    category : cat,
                    trend : response['entities'][j]['text'],
                    senti : s
             };
            Trend.remove({'category':cat}, function(err){
                    if(!err){
                        
                        console.log("success");
                    }    
            });
            Trend.create(dbVal, function(err){
                    if(err){
                        console.log(err);
                    }                    
                });
        //} //if
    } //for
    });
}   
    
    
    
};
          //  socket.emit('twitter-stream', {geo:outputPoint,cat:globalCategory});
//    socket.emit("connected");


    
runForCategory();
