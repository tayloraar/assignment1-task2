const express = require('express')
const moment=require('moment')
const app = express()
const port = 3000
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { MongoClient } = require("mongodb");
//const playerObj = require("./playerObj")
//const displayService = require("./services/displayServices")
//const actionLogService = require("./services/actionLogService")
const mongoose = require('mongoose');
let count=0
let listdesuser=[]
let checkuserexist=false
let statusgame=""
let socketofeachuser;
let checksocketexist=false
    /*Update action log
    To use this function to broadcast an action to the actionlog simply add this to any function
            let data = {
            name: nameplayer,
            action: action
          }
        $.get('/actionLog',data)
    */
   function updateActionLog(res,req){
    const name=req.req.query.name
    const action = req.req.query.action
     const data={
       name:name,
       action:action
     }
    io.emit("updateactionlog",data)
    io.on('updateactionlog', data => {
      $('#actionLogWindow').append(`${data.name} has ${data.action}<br/>`)
    //console.log("action log hit")
    res.send("action log hit")
  });
}

function listenActionLog(data){


    
}
module.exports = {
    listenActionLog,
    updateActionLog
  }