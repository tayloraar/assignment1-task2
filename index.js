
var socket
var username
  $(document).ready(function(){
    $("#submit").click(function(){
      socket= io();
      //Get username from text input
      username= $('#first_name').val()
      //Validate Empty value
      if(username!=""){
      localStorage.setItem("user", username);
      //Push username to server
      socket.emit('username', username);
      //If server check the same name issue=> server will return error
      socket.on('userexisterror', function(data) {
        alert(data)
        });
      //If username is not exist in game room=> Redirect user to playing page
      socket.on('redirect', function(destination) {
        window.location.href = destination;
        });
      }
      else{
          alert("username is empty")
      }
    });
  });