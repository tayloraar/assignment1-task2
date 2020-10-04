const express = require('express')
const moment=require('moment')
const app = express()
const port = 3000
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
let count=0
let listdesuser=[]
let checkuserexist=false
let statusgame=""
let socketofeachuser;
let checksocketexist=false

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
function checkuserdisconnect(socketid){
  let username
  listdesuser.forEach((user) => { 
    if(user.socket==socketid){
       username=user.name
      return
    }
  });
  return username
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
      description:description,
      action:'purple monkey dishwasher'
    }
   io.emit("updatechatbox",data) 
   res.send("OK") 
  });

app.get('/actionLog', function(req, res){
    const name=req.query.name
   const action = req.query.action
    const data={
      name:name,
      action:action
    }
    io.emit("updateactionlog",data)
    res.send("action log hit")
    });

io.on('connection', (socket) => {
    socketofeachuser=socket.id
    socket.on('disconnect', (reason) => {
    const name=checkuserdisconnect(socket.id)
      const data ={
        name:name,
        action: " disconnected"
      }

      userdisconnection(socket.id)
      io.emit("updateactionlog",data) 
      });
  })
  ;
  function insertion(){
    // Replace the following with your Atlas connection string                                                                                                                                        
  const url = "mongodb+srv://eGTB4yl0HFJQ6lzD:eGTB4yl0HFJQ6lzD@project.wdfid.mongodb.net/Project?retryWrites=true&w=majority";
  const client = new MongoClient(url);
  
  async function run() {
      try {
          await client.connect();
          console.log("Connected correctly to server");
          const db = client.db("project");
  
           
           var col = db.collection("login");
           var myobj = { username: "voungtan", address: "Highway 37" };
           await col.insertOne(myobj);
  
           col = db.collection("viewuserscoredata");
           myobj = { user_name: "voungtan", Score: 37000 ,Round:1,Datetime:"04/30/2020 13:01:01"};
           await col.insertOne(myobj);
           col = db.collection("historytabledata");
           myobj = { user_name: "voungtan", Score: 37000 ,Round:1,Datetime:"04/30/2020 13:01:01"};
           await col.insertOne(myobj);
  
           col = db.collection("startinggamedata");
           myobj = { user_name: "voungtan", Total_players: 5,Character_Cards:16,Role_Cards:7,Playing_Cards:80,Character_Card_Name:"Bart Cassidy" ,Character_Card_Feature_Description:"This is a card",Character_Bullets:4,Role_Card_Name:"Sheriff"
           ,Role_Card_Feature_Description:"This is Description",Playing_Card_Name:"Playing_Card_Name",Color_Playing_Card :"Blue",Character_Card_Images:"",Role_Card_Images:"",Playing_Card_Images:""};
           await col.insertOne(myobj);
           col = db.collection("Displaygameinterface");
           myobj = { user_name: "voungtan", User_character_card_Images: "",User_Role_Card_Images:"",User_Playing_card_Images:"",Current_Bullets:"",Table_Card_Images:"" };
           await col.insertOne(myobj);
           col = db.collection("Randomlygiveonecharactercard");
           myobj = { user_name: "voungtan", Character_Cards: "Highway 37",Character_Card_Name:"" };
           await col.insertOne(myobj);
           col = db.collection("Applylimitedtimeplayerturn");
           myobj = { user_name: "voungtan", Current_time: "Highway 37",Limited_time:"" };
           await col.insertOne(myobj);
           col = db.collection("Applyfeatureofcharactercard");
           myobj = { user_name: "voungtan", Character_Card_Name: "Highway 37",CharacterCard_Feature_Description:"" };
           await col.insertOne(myobj);
           col = db.collection("Applyfeatureofrolecard");
           myobj = { user_name: "voungtan", Role_Card_name: "Highway 37",Role_Card_Feature_Description:"" };
           await col.insertOne(myobj);
           col = db.collection("Applyplayersorder");
           myobj = { user_name: "voungtan", User_Order: 4};
           await col.insertOne(myobj);
           col = db.collection("Applycurrentdistance");
           myobj = { user_name: "voungtan", Distance_user_to_opponents: 4,Distance_opponents_to_user:2};
           await col.insertOne(myobj);
           col = db.collection("Drawingcards");
           myobj = { user_name: "voungtan", Current_user_cards: "tst",Updated_user_cards:"order",Current_user_card_images:"",Updated_user_card_images:""};
           await col.insertOne(myobj);
           col = db.collection("Usercanplayspecificcards");
           myobj = { user_name: "voungtan", Current_user_cards: "tst",Updated_user_cards:"order",Current_user_card_images:"",Updated_user_card_images:""};
           await col.insertOne(myobj);
           col = db.collection("Rewardfunction");
           myobj = { user_name: "voungtan", Current_user_cards: "tst",Updated_user_cards:"order",Current_user_card_images:"",Updated_user_card_images:""};
           await col.insertOne(myobj);
           col = db.collection("Bangfunction");
           myobj = { user_name: "voungtan", Target_name: "tst",Playing_Card_Name:"order",Updated_Bullets:"",Current_Bullets:""};
           await col.insertOne(myobj);
           col = db.collection("Missedfunction");
           myobj = { user_name: "voungtan", Target_name: "tst",Playing_Card_Name:"order"};
           await col.insertOne(myobj);
           col = db.collection("ncreaseandDecreaseDistance");
           myobj = { user_name: "voungtan", Target_name: "tst",increaseorDecrease_Distance_user_opponents:"order",IncreaseorDecreaseDistance_opponents_user:"",
           Distance_user_to_opponents:"Distance_user_to_opponents",Distance_opponents_to_user:'Distance_opponents_to_user'};
           await col.insertOne(myobj);
           col = db.collection("changingweapon");
           myobj = { user_name: "voungtan", Current_Weapon: "tst",Distance_current_weapon:"order",Updated_Weapon:"",Distance_updated_weapon:""}
           await col.insertOne(myobj);
         
           col = db.collection("DrawFunction");
           myobj = { user_name: "voungtan", Playing_Card_Name: "tst",Used_Compared_Card:"order",Updated_user_cards:""}
           await col.insertOne(myobj);
           col = db.collection("Drawoneplayerscard");
           myobj = { user_name: "voungtan", Target_name: "tst",Playing_Card_Name:"order",Updated_user_cards:""}
           await col.insertOne(myobj);
           col = db.collection("Discardingcardfromanotherperson");
           myobj = { user_name: "voungtan", Target_name: "tst",Playing_Card_Name:"order",Updated_user_cards:""}
           await col.insertOne(myobj);
           col = db.collection("Discardingcardfromgame");
           myobj = { user_name: "voungtan", Playing_Card_Name: "tst",Updated_Table_Card :"order"}
           await col.insertOne(myobj);
           col = db.collection("Jailfunction");
           myobj = { user_name: "voungtan", Targetname : "tst",Playing_Card_Name :"order"}
           await col.insertOne(myobj);
           col = db.collection("Gunbattle");
           myobj = { user_name: "voungtan", Targetname : "tst",Playing_Card_Name :"order",Current_Bullets:3,Updated_Bullets:2}
           await col.insertOne(myobj);
           col = db.collection("Storeusersscore");
           myobj = { user_name: "voungtan", Rank : 1,Round :1}
           await col.insertOne(myobj);
           col = db.collection("Displaywinningplayer");
           myobj = { user_name: "voungtan", Rank : 1,Round :1}
           await col.insertOne(myobj);
           col = db.collection("Disconnection");
           myobj = { user_name: "voungtan", Rank : 1,Round :1,User_Order:4}
           await col.insertOne(myobj);
  
           col = db.collection("HistoryRecord");
           myobj = { RecordID: 1, Username : "Abo",Rank :1,Round:4}
           await col.insertOne(myobj);
           col = db.collection("PlayingCard");
           myobj = { PlayingCardID: 1, PlayingCardID :"ACE",PlayingCardDescription :"hbchj",PlayingCardImages:"101124"}
           await col.insertOne(myobj);
           col = db.collection("RoleCard");
           myobj = { RoleCardID: 1, RoleCardName :"ACE",RoleCardDescription :"hbchj",RoleCardImages:"101124"}
           await col.insertOne(myobj);
           col = db.collection("CharacterCard");
           myobj = { CharacterCardID: 1, CharacterCardName :"ACE",CharacterCardDescription :"hbchj",CharacterCardImages:"101124"}
           await col.insertOne(myobj);
  
  
  
           console.log("Inserted");
  
  
  
  
      } catch (err) {
          console.log(err.stack);
      }
      finally {
          await client.close();
      }
  }
  run().catch(console.dir);
  }
  function connection(){
    // Replace the following with your Atlas connection string                                                                                                                                        
  const url = "mongodb+srv://eGTB4yl0HFJQ6lzD:eGTB4yl0HFJQ6lzD@project.wdfid.mongodb.net/Project?retryWrites=true&w=majority";
  const client = new MongoClient(url);
  
  async function run() {
      try {
          await client.connect();
          console.log("Connected correctly to server");
           
  
  
      } catch (err) {
          console.log(err.stack);
      }
      finally {
          await client.close();
      }
  }
  
  run().catch(console.dir);
  }
http.listen(3000, () => {
  connection();
  insertion(); //insertion now
  console.log('listening on *:3000');
});