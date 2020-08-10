var express = require('express');
var moment = require('moment');
const MongoClient = require('mongodb').MongoClient;

var app=express();

app.use(express.static(__dirname + '/public'));

var log = function(message){
    var time=moment().format();
    console.log( `[Server] @ ${time} ${message}`);
}

var port = 3000;
app.listen(port);
log(`server listening on: ${port}`);

app.get("/comment",function(req,res){
    let comment=req.query.comment;
    let commentId=req.query.commentId;
    insertComment(comment,commentId);
    res.send("added");
})

app.get("/newPost",function(req,res){
    let user=req.query.user;
    let image=req.query.image;
    let caption=req.query.caption;
    let postNum=req.query.postNum;
    insertPost(user,image,caption,postNum);
    res.send("added");
})

app.get("/comments", function(req,res){
    retrieveComment(res);
   })

app.get("/postnum", function(req,res){
    retrievePostNum(res);
   })

//DataBase Management.

const uri = "mongodb+srv://sit725:sit725@sit725-assignment1-task.la1a9.mongodb.net/insta?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

//setting collection variables
let collectionMessages;
let collectionComments;

let collectionPosts;
// let user;
// let image;
// let caption;
// let comment;

// connecting collection variables to database collections
client.connect(err => {
    collectionMessages = client.db("insta").collection("messages");
    collectionComments = client.db("insta").collection("comments");
    collectionPosts = client.db("insta").collection("posts");
// let image;
// let caption;
// let comment;
    
  });
  
//insterting into Comment Collection
const insertComment=(comment,commentId)=>{
   collectionComments.insertOne({comments:comment, commentId:commentId});
};

//insterting into Posts Collection
const insertPost=(user,image,caption,postNum)=>{
    collectionPosts.insertOne({user:user, image:image, caption:caption, postNum:postNum});
 };

//retreiving from collections
const retrieveComment=(res)=>{
    collectionComments.find().toArray(function(err,result){
        if (err) throw err;
        res.send(result);
    });
};

//retreiving Posts
const retrievePostNum=(res)=>{
    collectionPosts.find().toArray(function(err,result){
        if (err) throw err;
        res.send(result);
    });
};