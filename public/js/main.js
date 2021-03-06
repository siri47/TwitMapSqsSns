
//Initilize
function normalMapInitialize() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.SATELLITE
        }
        var map = new google.maps.Map(mapCanvas, mapOptions)
};

//Initialize
var map, heatmap;
var pointArray = new google.maps.MVCArray(); 


function heatMapInitialize() {
  // the map's options
  var mapOptions = {
    zoom: 1,
    center: new google.maps.LatLng(0,0),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  // the map and where to place it
map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
  // what data for the heatmap and how to display it
heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray,
    radius: 25
  });
  // placing the heatmap on the map
  heatmap.setMap(null);
    
  heatmap.setMap(map);
}

        //marker.setMap(null)
      /*setTimeout(function(){
        marker.setMap(null);
      },20000);*/

if(io !== undefined) {
    console.log("\nhi begin");
    // Storage for WebSocket connections
    var socket = io.connect('/');
    //var use = socket.socket;
    // This listens on the "twitter-steam" channel and data is 
    // received everytime a new tweet is receieved.
    /*use.on('connect_failed', function(){
    console.log('Connection Failed');
    });*/
    socket.on('twitter-stream', function(data){
            //Add tweet to the heat map array.
            var category1= data.cat;
            var geo= data.geo;
            console.log('got new Data'+  category1 +' '+category);
            if (category1 == category){
                console.log(data.geo);
                var tweetloc= new google.maps.LatLng( geo["lat"],geo["lng"]);
                var marker = new google.maps.Marker({
                position: data.geo,
                map: map,
            });
            //pointArray.push(tweetloc);  
            //google.maps.event.addDomListener(window, 'load', heatMapInitialize());
            }
          //Flash a dot onto the map quickly
          //var image = "css/small-dot-icon.png";


    });
    socket.on('sentiment',function(data){
        var dispData = data.m;
        console.log("new new");
        console.log(dispData.Message);
        var senti = '- ' + dispData.Message.split(' ')[0].toUpperCase() + '';
        var message = ''+dispData.Message.slice( dispData.Message.search(' ') + 1) + '';
        $.snackbar({content:message+' '+senti});
    });
};

category="sports";
function temp(category) { 
    
//pointArray=[]
//category = document.getElementById('keywords').value;  
$.get("/api/getAllTweets/"+category,function(data, status){
    pointArray = [];
    for (i in data){
        //console.log(data[i]['geo']['coordinates']['0']);
    var tweetLocation = new google.maps.LatLng(data[i]['geo']['coordinates']['0'],data[i]['geo']['coordinates']['1']);
        //console.log(tweetLocation);
        pointArray.push(tweetLocation);
    }
        google.maps.event.addDomListener(window, 'load', heatMapInitialize());
});
        //console.log(pointArray);
var trends=[]
var sentiment=[]
var mydiv1=document.getElementById('overallSentiment');
var newcontent1 = document.createElement('div');
mydiv1.innerHTML='';
$.get("/api/getSenti/"+category,function(data,status){
    console.log("sentiment printing");
    console.log(data);
    sentiment=data[0]['senti'];
        newcontent1.innerHTML = "<b>"+sentiment+"</i><br><hr>";
        while (newcontent1.firstChild) {
        mydiv1.appendChild(newcontent1.firstChild);
    }
});
var mydiv=document.getElementById('trending');
var newcontent = document.createElement('div');
mydiv.innerHTML='';
$.get("/api/getTrends/",function(data,status){
    console.log("Trends printing");
    console.log(data);
    for ( i in data){
        console.log(data[i]);
        trends[i]=data[i]['text'];
        newcontent.innerHTML = "<b>"+trends[i]+"</i><br><hr>";
        while (newcontent.firstChild) {
        mydiv.appendChild(newcontent.firstChild);
    }
}
});
};
    
    





