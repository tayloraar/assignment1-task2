let socketid;
let statusregis;
let nameplayer;
let role;
let action;
let socket=io.connect('http://localhost:3000');
window.onload = function(e){ 
  $.get('/desuser', function(res){
    $('#waiting').text(res)
  });
  $.get('/socketid', function(res){
    socketid=res
  });
  getdescriptionofuser()
  getstatusgame()
  updatechatbox () 
  updateActionLog()
}


//Join Game button
  $(document).ready(function(){
    $("#joinGameBtn").click(function(){
      let username=$('#joinName').val()
      let action= 'joined the game'
      if(username!=""){
      const user={
        user:username,
        socket:socketid,
        }
      $.get('/submitname',user, function (responsedata) {
        alert(responsedata)
        if(responsedata=="Successful"){
        nameplayer=user.user

          let data = {
            name: username,
            action: action,
            socket: socketid
          }
          
        $.get('/actionLog',data)
        $.get('/newUser', data)
      }
        statusregis=responsedata     
      })
      $('#joinName').val("")
    }
    else{
      alert("Username is not null")
    }
    });
  });



//Send message to chat box
  $(document).ready(function(){
    $("#sendMsgBtn").click(function(){
     const text=$('#msgInput').val()
     let action = 'sent a message'
     if(text!=""&&(statusregis=="Successful"||statusregis=="You already registered")){
      const data={
        name:nameplayer,
        descriptiontext:text,
        action:action
      }

      $.get('/chatbox',data, function (responsedata) {
           console.log(responsedata)
      })

      $.get('/actionLog',data)

      $('#msgInput').val("")
     }
     else if(text=="") {
      alert("Please input text on chatbox")
     }
     else{
      alert("You must register before starting chat")
     }
    });
  });


//Get number of user
  function getstatusgame(){
    socket.on('statusgame', data => {
      $('#waiting').text(data)
    });
  }
  //Update message chat on chat box
  function updatechatbox(){
    socket.on('updatechatbox', data => {
    $('#messageWindow').append("player ",data.name,":",data.description,"<br/>")
  }); 
}
    /*Update action log
    To use this function to broadcast an action to the actionlog simply add this to any function
            let data = {
            name: nameplayer,
            action: action
          }
        $.get('/actionLog',data)
    */
    function updateActionLog(){
      socket.on('updateactionlog', data => {
        $('#actionLogWindow').append(`${data.name} has ${data.action}<br/>`)
      console.log("action log hit")
    });
  }
//Get information of players and push to screen
  function getdescriptionofuser(){
    socket.on('descriptionuser', data => {
        updatelistuser(data)
    });
  }

  function updatelistuser(listdata){
     $('#player1').empty()
     $('#player2').empty()
     $('#player3').empty()
     $('#player4').empty()
     $('#player5').empty()
     const mydata= JSON.parse(listdata)       
     mydata.forEach((data) => {
      console.log(data.id)
      const player="#player"+data.id
      $(player).append("Player "+data.id+": "+data.name)
    });

  }
