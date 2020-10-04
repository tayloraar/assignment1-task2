var socket = io();
window.onload = (event) => {
    var lastname = localStorage.getItem("user");

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
  };