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