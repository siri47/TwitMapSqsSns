Project link : https://github.com/siri47/TwitMapSqsSns
UNI : 
sh3451
kp2652


Softwares used:

Backend :
Used mongoLab service provided by heroku.
Heroku is a cloud platform as a service supporting several programming languages.

Server:
NodeJS is used for server side environment.
serverSQS.js is the main server file.

Frontend:
HTML, CSS(Material Design Lite) and Java Script.  

Server is deployed on AWS Elastic Beanstalk.


Brief Summary : 

We start by using twit - Twitter API Client for node. This supports both the REST and STREAMING API.

Usage:

var Twitt = require('twit')

var T = new Twitt({
    consumer_key:         '...'
  , consumer_secret:      '...'
  , access_token:         '...'
  , access_token_secret:  '...'
})

We use the Streaming API - T.stream(path, [params]), that keeps the connection alive, and returns an EventEmitter.

We use only the tweets with Geo enable in order to get their coordinated to plot on the map.

The geo enabled tweets are put into mongodb hosted on Heroku ( a cloud environment). We use the “mongoose” driver for node js. 

We categorize the tweets into 4 categories : sports, movies, technology and politics using a bag of words for each category. 

Once the tweet is received, it is put into the SQS queue.
A thread pool of 10 threads is created. Any available thread is made to receive the SQS message. The body of this SQS message is the tweet text. This message body is sent as input to AlchemyAPI for sentiment analysis. The result is published as a message to an SNS topic.

There is a SNS subscriber which is called on the server-side which receives the sentiment of the tweet text. This information of tweet and sentiment is sent over the web socket to be displayed on the UI.

We have used Tweet trends/places API to get the trending tweets. We also display the overall sentiment for every category.

The front end is coded in HTML, CSS and JavaScript. 

We use the google map API to show the distribution of tweets. We access the records from db and plot it as a heat map. 

The live tweets obtained are sent through sockets to the front end and appear as markers on the heat map. This is so that we can clearly see the new arriving tweets. 

In order to find trends amongst the tweets, we use Alchemy API. We use entity extraction and sentiment extraction and update the results for each category on the web page.

Deploying on AWS Elastic BeanStalk:

Download AWS command line tools. 

After committing the changes to git and pushing it, we run the on the command line

eb init

eb create 

eb deploy

Now go to your environment dashboard and access the web page by clicking the link next to the title.


Materials used -
1. Used one of the starting templates from Material Design Lite frameowork ( A CSS framework for material design by Google ).
https://github.com/google/material-design-lite
2. http://www.codingdefined.com/2015/09/how-to-fetch-trending-tweets-in-nodejs.html

