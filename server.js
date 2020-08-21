
// This is the webserver and end points used in this application.

var open = require("open");
var express = require('express');
var moment = require('moment');
var app=express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var log = function(message){
  var time=moment().format();
  console.log( `[Server] @ ${time} ${message}`);
}

var port = 3000;
app.listen(port);
log(`server listening on: ${port}`);

// DataBase Management.
const uri = "mongodb+srv://sit725:sit725@sit725-assignment1-task.la1a9.mongodb.net/insta?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Setting collection variables
var collectionMessages;
var collectionComments;
var collectionPosts;


// Connecting collection variables to database collections
client.connect(err => {
  collectionMessages = client.db("insta").collection("messages");
  collectionComments = client.db("insta").collection("comments");
  collectionPosts = client.db("insta").collection("posts"); 
});

// Post end points
app.post("/comment", function(req,res){
  let comment = req.body;
  insertComment(comment,res);
})

app.post("/post", function(req,res){
  let post = req.body;
  insertPost(post,res);
})

// Get end points
app.get("/comments", function(req,res){
  retrieveComment(res);
});

app.get("/postnum", function(req,res){
  retrievePostNum(res);
});

// Insterting into Comment Collection
const insertComment=(comment,res)=>{
 let date = new Date();
 comment.date=date.getTime();
 collectionComments.insertOne(comment,(err,result)=>{
  res.send({result:200});
 });
}

// Insterting into Posts Collection
const insertPost=(post,res)=>{
  let date = new Date();
 post.date=date.getTime();
 collectionPosts.insertOne(post,(err,result)=>{
  res.send({result:200});
 });
}
// Retreiving from collections
const retrieveComment=(res)=>{
  collectionComments.find().toArray(function(err,result){
    if (err) throw err;
    res.send(result);
  });
}

// Retreiving Posts
const retrievePostNum=(res)=>{
  collectionPosts.find().toArray(function(err,result){
    if (err) throw err;
    res.send(result);
  });
}

// Opens the application after 2 seconds, timer just incase.
setTimeout( function(){
  open("http://localhost:3000/");
 }, 2000 );
