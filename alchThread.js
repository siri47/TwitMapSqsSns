var AlchemyAPI = require('./app/alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();
var sleep=require('sleep');
var AWS = require('aws-sdk');
var sns = new AWS.SNS(
    {
            region: 'us-east-1',//config.aws.region,
    accessKeyId: '',//config.aws.accessID,
    secretAccessKey: '',//config.aws.secretKey,

        params: {TopicArn: 'arn:aws:sns:us-east-1:202100215321:FirstTopic'}});

module.exports =  {
    
    tweetProcess : function(txt){
        console.log('thread:'+txt);

        output={};
                    sleep.sleep(2);
        alchemyapi.sentiment('text', txt, {}, function(response) {
            output['sentiment'] = { text:txt, response:JSON.stringify(response,null,4), results:response['sentiment'] };
            console.log('========================================');
            //while(response == null || response === undefined );
            console.log(response['docSentiment']);  
            if( typeof(response['docSentiment']) === "undefined" )
                return;
sns.publish({Message: response['docSentiment']['type']+' '+txt}, function (err, data) {
  if (!err) console.log('Message published');
    else console.log(err);
});           
            return response;
        });

        //return response;
    }
};
