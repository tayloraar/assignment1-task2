const e = require('express');
const express = require('express')
const moment=require('moment')
const app = express()
const port = 3000
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count=0
var listdesuser=[]
var checkuserexist=false
var statusgame;

//Function to update user id (position) after one user go out the game room
function  order_user(deleteid)
{
if(deleteid==1){
  for (var i=0;i<listdesuser.length;i++){
    listdesuser[i].id=i+1
  }
}
else if(deleteid!=1&&deleteid<5){
  for (var i=0;i<listdesuser.length;i++){
    if(listdesuser[i].id>deleteid){
      listdesuser[i].id=listdesuser[i].id-1
    }
  }
}
}
// Function to check username is exist or not
function checkexist(username){
  for (var i=0;i<listdesuser.length;i++){
    if(listdesuser[i].name==username){
      checkuserexist=true
      break;
    }
  }
}

io.on('connection', (socket) => {
    var name = "";
    // Server get username from client
    socket.on('username', function(data) {
    name=data
    let  username = data;
    checkexist(username)
    if(checkuserexist==false && listdesuser.length<5){ 
    // If username is not exist and game is not started => Allow client to redirect to playing page  
    var destination = '/playing.html';
    socket.emit('redirect', destination);
    }
    else if(checkuserexist==true){
      socket.emit("userexisterror","This username is exist")
    }
    else if(listdesuser.length>=5){
      socket.emit("userexisterror","There are five people in game room")
    }
    checkuserexist=false
    });
    
    socket.on('getdata', function(data) {
    //When user go into the playing page. Add user information into array and emit to all users about the array information.
    count=count+1
    let  userinfo = { id: count ,name: data, socket:socket.id};
    listdesuser.push(userinfo)
    io.emit("descriptionuser",JSON.stringify(listdesuser))
    // If array length =5 (enough players) => Game Status=Game start
    if(listdesuser.length==5){
    statusgame="game start"
    io.emit("statusgame",statusgame)
    }
    //If do not have enough player => Return the amount of waiting players.
    else{
    io.emit("statusgame","Wating for more " +(5-listdesuser.length)+ " People") 
    }   
     });

    socket.on('disconnect', (reason) => {
    //When one user disconnect => Update array information and emit to all user about updated array information
    for (var i=0;i<listdesuser.length;i++){
      if(listdesuser[i].socket==socket.id){
        var deleteid=listdesuser[i].id
        listdesuser.splice(i,1)
        count=count-1
        if(listdesuser.length>0){
        order_user(parseInt(deleteid))
        }
        io.emit("descriptionuser",JSON.stringify(listdesuser)) 
        break;
      }
    }
    // Update the amount of waiting players
    if(statusgame==null){
    io.emit("statusgame","Wating for more " +(5-listdesuser.length)+ " People") 
    }   
      });
  })
  ;

//Run node as a web server for hosting static files (html)
app.use(express.static(__dirname+"/"))

http.listen(3000, () => {
  console.log('listening on *:3000');
});