var firebase = require('firebase');
const http= require("http");
const socketio= require("socket.io");
var AWS = require("aws-sdk");

const server= http.createServer((req,res)=>{

    res.end("I am connected.");
});

const io= socketio(server, {

    cors: {
        origin: '*',
    },
});



var firebaseConfig = {
    apiKey: MY_API_TOKEN,
    authDomain: "drts-4fca2.firebaseapp.com",
    databaseURL: "https://drts-4fca2-default-rtdb.firebaseio.com",
    projectId: "drts-4fca2",
    storageBucket: "drts-4fca2.appspot.com",
    messagingSenderId: "619963004239",
    appId: "1:619963004239:web:681fd381ea59874d05013a",
    measurementId: "G-MYFNGNVRFT"
  };


firebase.initializeApp(firebaseConfig)

var database = firebase.database()

function fetchData(callbackFun){
database.ref().once("value")
.then(function(snapshot) {
    // console.log( snapshot.val() );
    callbackFun(snapshot);
})
}

function remLogic(item){

     // console.log(item.val());
     var hospString= JSON.stringify(item.val());
     // console.log(hospString);
     var hospList= JSON.parse(hospString);
     console.log(hospList);
     var totalRecord =  item.numChildren();
     console.log(totalRecord);
     var hospName= Object.values(hospList)[0].name;
     console.log(hospName);

}


let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": MY_ACCESS_KEY, "secretAccessKey": MY_SECRET_ACCESS_KEY
};

AWS.config.update(awsConfig);

var docClient = new AWS.DynamoDB.DocumentClient();
// var latitude;
var link;
var arrayData= [];
var count=0;
// var count=0;
function fetchOneByKey() {
    var params = {
        TableName: "esp8266_table",
        // Key: {
        //     "mac_Id": "84:cc:a8:a1:32:b9",
        //     "ts": 1621261907693
        // },
    //     FilterExpression: "#vib= :true",
    //     ExpressionAttributeNames: {
    //     "#vib": "random_number",
    // },
    //     ExpressionAttributeValues: {
    //       ":true": 20
    //      }
    };   


    docClient.scan(params, onScan);

    function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {

        console.log("Scan succeeded.");
        data.Items.forEach(function(sensor) {
            if(sensor.vib==1){
            var dataItem= sensor;
            // console.log(dataItem);
            // arrayData= [];
            arrayData.push(dataItem)
            count++;
           // console.log(sensor.random_number+" "+sensor.vib);
       }

        });

    if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }

    }
  }
}
// setTimeout(function(){
//     console.log(arrayData[0]);
//     console.log(count);
// }, 3000);

setTimeout(function(){
    
     io.on('connection',(socket,req)=>{

    for(i=0;i<count;i++){

    var randomNumber= (Math.random()*30+40).toFixed(4);
    console.log(randomNumber);

     var latitude = arrayData[i].random_number;
    console.log("Latitude is "+ latitude);

    // if(dataItem.random_number<=30){
    //     console.log("Sending notification to Hospital 1");
    // }
    // else if(dataItem.random_number>30 && val.random_number<=40){
    //     console.log("Sending notification to Hospital 2");
    // }
    // else{
    //     console.log("Sending notification to Hospital 3");
    // }

    var longitude= parseFloat(Number(latitude)+parseFloat(randomNumber)).toFixed(4);
    console.log("Longitude is "+longitude);

    link= "http://maps.google.com/maps?&z=15&mrt=yp&t=k&q="+latitude+"+"+longitude;
    console.log(link+"\n");

    socket.emit("welcome",{
        data: link
    });
    // socket.on('message',(msg)=>{
    //     console.log(msg);
    // });
}
});
    

},3000);

fetchOneByKey();

// fetchData(remLogic);

server.listen(8000);