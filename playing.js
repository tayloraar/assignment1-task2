var socket = io();
var lastname
window.onload = (event) => {
    lastname = localStorage.getItem("user");
    var elementarea = document.getElementById("textarea");
    elementarea.scrollTop = elementarea.scrollHeight;
    var elementchatbox = document.getElementById("chatbox");
    elementchatbox.scrollTop = elementchatbox.scrollHeight;
    socket.emit("getdata",lastname)
    // Update the number of user in game room. If have enough 5 people=> Game status=Game Start
    socket.on('statusgame', data => {
        $('#gamestatus').text(data)
      });


    // Update the user description : id (position), name
    socket.on('descriptionuser', data => {
        $('#text').empty()
       var mydata= JSON.parse(data)       
        for(var i=0;i<mydata.length;i++){
            $('#text').append("ID: "+ mydata[i].id)
            $('#text').append("<br />")
            $('#text').append("Name: "+ mydata[i].name)       
            $('#text').append("<br />")
            $('#text').append("<br />")
        }
      });
   // Update chatbox
   socket.on('updatechatbox', data => {
    $('#chatbox').append(data.name+": "+data.descriptiontext)
    $('#chatbox').append("<br />")
  });


  };
  $(document).ready(function(){
    $("#submitchat").click(function(){
     var text=$('#textarea').val()
     if(text!=""){
      var data={
        name:lastname,
        descriptiontext:text
      }
     socket.emit("sendtextchat",data)
     $('#textarea').val("")
     }
     else{
       alert("Please input text on chatbox")
     }
    });
  });
