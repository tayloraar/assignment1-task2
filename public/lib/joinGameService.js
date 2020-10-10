
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



//Get number of user
  function getstatusgame(){
    socket.on('statusgame', data => {
      $('#waiting').text(data)
    });
  }