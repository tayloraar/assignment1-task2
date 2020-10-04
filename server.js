import { createRequire } from 'module'
const require = createRequire(import.meta.url);
let __dirname = process.cwd();

const express = require('express')
const moment=require('moment')
const app = express()
const port = 3000
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let count=0
let listdesuser=[]
let checkuserexist=false
let statusgame=""
let socketofeachuser;
let checksocketexist=false
let message="";

//Run node as a web server for hosting static files (html)
app.use(express.static(__dirname+"/public"))

//Function to update user id (position) after one user go out the game room
function  order_user(deleteid)
{
if(deleteid==1){
  listdesuser.forEach((user) => { 
    user.id--
  });
}
else if(deleteid!=1&&deleteid<5){
  listdesuser.forEach((user) => { 
    if(user.id>deleteid){
      user.id--
    }    
  });
}
}

// Function to check username is exist or not
function checkexist(username,socketid){
  listdesuser.forEach((user) => {
    if(user.name==username){
      checkuserexist=true
      return;
    }
  });
}
// Function to check username is exist or not
function checksocketidexist(username,socketid){
  listdesuser.forEach((user) => {
    if(user.socket==socketid){
      checksocketexist=true
      return;
    }
  });
}
//Function to check validation of username input
function checkvalidation(username,socketid,res){
  checkexist(username,socketid)
  checksocketidexist(username,socketid)
  if(username==null){
    message="Error"
  }
  else if(checkuserexist==true){
    message="This username is exist"
    checkuserexist=false
  }
  else if(checksocketexist==true){
    message="You already registered"
    checksocketexist=false
  }
  else if(listdesuser.length>=5){
    message="There are five people in game room"
  }
  else{
    message="Successful"
}
return message
}

//Function to push user information to list
function pushdatatolist(username,socketid){
count++
let  userinfo = { id: count ,name: username, socket:socketid};
listdesuser.push(userinfo)
io.emit("descriptionuser",JSON.stringify(listdesuser))
io.emit("statusgame","Wating for more " +(5-listdesuser.length)+ " People") 
}

//Function to count the number players
function checknumberofplayer(){
  const numberofuser=listdesuser.length
   // If array length =5 (enough players) => Game Status=Game start
    if(numberofuser==5){
      statusgame="START GAME"
      io.emit("statusgame",statusgame)
    }
    //If do not have enough player => Return the amount of waiting players.
    else{
    statusgame="Wating for more " +(5-listdesuser.length)+ " People"
    io.emit("statusgame",statusgame) 
    }   
}

//Function when one user out game
function userdisconnection(socketidout){
  listdesuser.forEach((user) => {
    if(user.socket==socketidout){
     let lengtharrayuser=listdesuser.length
     let deleteid=user.id
     listdesuser.splice((user.id-1),1)
     count--
     if(lengtharrayuser>0){
      order_user(parseInt(deleteid))
     }
     io.emit("descriptionuser",JSON.stringify(listdesuser)) 
    }
    return;
  });
    // Update the amount of waiting players
    if(statusgame!="start game"){
    io.emit("statusgame","Wating for more " +(5-listdesuser.length)+ " People") 
    }  
}
app.get('/submitname', function(req, res) {
const username=req.query.user
const socketid=req.query.socket
message=checkvalidation(username,socketid,res)
res.send(message)
if(message=="Successful"){
pushdatatolist(username,socketid)
}
checknumberofplayer()
});

app.get('/desuser', function(req, res){
  res.send("Wating for more " +(5-listdesuser.length)+ " People")
  io.emit("descriptionuser",JSON.stringify(listdesuser)) 
});

app.get('/status', function(req, res){
  io.emit("statusgame","Wating for more " +(5-listdesuser.length)+ " People")   
});
app.get('/socketid', function(req, res){
  res.send(socketofeachuser)
});

app.get('/chatbox', function(req, res){
    const name=req.query.name
    const description=req.query.descriptiontext
    const data={
      name:name,
      description:description
    }
    res.send("OK")
    io.emit("updatechatbox",data)
  });


io.on('connection', (socket) => {
    socketofeachuser=socket.id
    socket.on('disconnect', (reason) => {
      userdisconnection(socket.id)
      });
  })
  ;
http.listen(3000, () => {
  console.log('listening on *:3000');
});