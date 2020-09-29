let socketid;
let statusregis;
let username;
let socket=io.connect('http://localhost:3000');
//Event call when user load page
$.get('/desuser', function(res){
  $('#waiting').text(res)
});
$.get('/socketid', function(res){
  socketid=res
});
getdescriptionofuser()
getstatusgame()
updatechatbox () 
//Join Game button
  $(document).ready(function(){
    $("#joinGameBtn").click(function(){
      username=$('#joinName').val()
      if(username!=""){
      const user={
        user:username,
        socket:socketid
      }
      $.get('/submitname',user, function (responsedata) {
        alert(responsedata)
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
     if(text!=""&&statusregis=="Successful"){
      const data={
        name:username,
        descriptiontext:text
      }
      $.get('/chatbox',data, function (responsedata) {   
      })
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
    $('#messageWindow').append(data.name+": "+data.description)
    $('#messageWindow').append("<br />")
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
      let player="#player"+data.id
      $(player).append("Player "+data.id+": "+data.name)
    });

  }
  