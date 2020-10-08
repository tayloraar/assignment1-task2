let socketid;
let statusregis;
let nameplayer;

let role;
let action;
let character;

let phasenumber
let phaseuser

let socket = io.connect('http://localhost:3000');


window.onload = function (e) {
  $.get('/desuser', function (res) {
    $('#waiting').text(res)
  });
  $.get('/socketid', function (res) {
    socketid = res
  });
  getdescriptionofuser()
  getstatusgame()
  updatechatbox()
  updateActionLog()
  randomdelivercharactercard()
  getinforphase()
  updatetime()
}


//Join Game button
$(document).ready(function () {
  $("#joinGameBtn").click(function () {
    let username = $('#joinName').val()
    let action = 'joined the game'
    if (username != "") {
      const user = {
        user: username,
        socket: socketid,
      }
      $.get('/submitname', user, function (responsedata) {
        alert(responsedata)
        if (responsedata == "Successful") {
          nameplayer = user.user

          let data = {
            name: username,
            action: action,
            socket: socketid
          }
          $.get('/actionLog', data)
          $.get('/newUser', data)
        }
        statusregis = responsedata
      })
      $('#joinName').val("")
    }
    else {
      alert("Username is not null")
    }
  });
});



//Send message to chat box
$(document).ready(function () {
  $("#sendMsgBtn").click(function () {
    const text = $('#msgInput').val()
    let action = 'sent a message'
    if (text != "" && (statusregis == "Successful" || statusregis == "You already registered")) {
      const data = {
        name: nameplayer,
        descriptiontext: text,
        action: action
      }

      $.get('/chatbox', data, function (responsedata) {
      })

      $.get('/actionLog', data)

      $('#msgInput').val("")
    }
    else if (text == "") {
      alert("Please input text on chatbox")
    }
    else {
      alert("You must register before starting chat")
    }
  });
});
//Function to get information of phase
function getinforphase() {
  socket.on("infophase", data => {
    console.log("Roundof: " + data.name + "---RoundofID: " + data.id + "----Phase: " + data.phase)
    phaseuser = data.name
    phasenumber = data.phase
  })
}
//Function Update up to second about phase information
function updatetime() {
  socket.on("timeupdate", data => {
    $("#nameturn").empty()
    $("#timeturn").empty()
    $("#phase").empty()
    console.log(data.phase)
    $("#nameturn").append("Player :" + data.name)
    $("#phase").append("Phase :" + data.phase)
    $("#timeturn").append("Minute: " + data.min + " Seconds:" + data.sec)

  })
}
//Random deliver charactercard
function randomdelivercharactercard() {
  socket.on("randomgivecharacter", data => {
    const mydata = JSON.parse(data)
    mydata.forEach((data) => {
      if (data.socket == socketid) {
        character = data.character
        $("#maincharacterimage").attr('src', "assets/cards/" + data.character + ".png")
        $("#mainBullets").html(getBulletString(data));
        displayordercharacter(mydata, data)
      }
    })
 

  })
}
//Get display order for character card
function displayordercharacter(mydata, data) {
  console.log(data.id)
  if (data.id == 1) {
    //distribute card display according to position
    $("#topleft").attr('src', "assets/cards/" + mydata[2].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[1].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[3].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[4].character + ".png")
    //distribute bullet display according ot position
    $("#c5 .bulletTray").html(getBulletString(mydata[2]));
    $("#b5 .bulletTray").html(getBulletString(mydata[1]));
    $("#d5 .bulletTray").html(getBulletString(mydata)[3]);
    $("#e5 .bulletTray").html(getBulletString(mydata)[4]);
  }
  else if (data.id == 2) {
    $("#topleft").attr('src', "assets/cards/" + mydata[3].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[2].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[4].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[0].character + ".png")
    //distribute bullet display according ot position
    $("#c5 .bulletTray").html(getBulletString(mydata[3]));
    $("#b5 .bulletTray").html(getBulletString(mydata[2]));
    $("#d5 .bulletTray").html(getBulletString(mydata[4]));
    $("#e5 .bulletTray").html(getBulletString(mydata[0]));
  }
  else if (data.id == 3) {
    $("#topleft").attr('src', "assets/cards/" + mydata[4].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[3].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[0].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[1].character + ".png")
    //distribute bullet display according ot position
    $("#c5 .bulletTray").html(getBulletString(mydata[4]));
    $("#b5 .bulletTray").html(getBulletString(mydata[3]));
    $("#d5 .bulletTray").html(getBulletString(mydata[0]));
    $("#e5 .bulletTray").html(getBulletString(mydata[1]));
  }
  else if (data.id == 4) {
    $("#topleft").attr('src', "assets/cards/" + mydata[0].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[4].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[1].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[2].character + ".png")
    //distribute bullet display according ot position
    $("#c5 .bulletTray").html(getBulletString(mydata[0]));
    $("#b5 .bulletTray").html(getBulletString(mydata[4]));
    $("#d5 .bulletTray").html(getBulletString(mydata[1]));
    $("#e5 .bulletTray").html(getBulletString(mydata[2]));
  }
  else if (data.id == 5) {
    $("#topleft").attr('src', "assets/cards/" + mydata[1].character + ".png")
    $("#midleft").attr('src', "assets/cards/" + mydata[0].character + ".png")
    $("#topright").attr('src', "assets/cards/" + mydata[2].character + ".png")
    $("#midright").attr('src', "assets/cards/" + mydata[3].character + ".png")
    //distribute bullet display according ot position
    $("#c5 .bulletTray").html(getBulletString(mydata[1]));
    $("#b5 .bulletTray").html(getBulletString(mydata[0]));
    $("#d5 .bulletTray").html(getBulletString(mydata[2]));
    $("#e5 .bulletTray").html(getBulletString(mydata[3]));
  }
}
//Get number of user
function getstatusgame() {
  socket.on('statusgame', data => {
    $('#waiting').text(data)
  });
}
//Update message chat on chat box
function updatechatbox() {
  socket.on('updatechatbox', data => {
    $('#messageWindow').append("player ", data.name, ":", data.description, "<br/>")
  });
}

//Generates string to display bullets according to current life points
const getBulletString = (player) => {
  let bulletString = "";
  let i = 0;
  while (i < player.currentLife) {
    bulletString += '<img src="assets/bullet.png" alt="" class="responsive"></img>';
    i++;
  }
  return bulletString;
}

/*Update action log
To use this function to broadcast an action to the actionlog simply add this to any function
        let data = {
        name: nameplayer,
        action: action
      }
    $.get('/actionLog',data)
*/
function updateActionLog() {
  socket.on('updateactionlog', data => {
    $('#actionLogWindow').append(`${data.name} has ${data.action}<br/>`)
  });
}
//Get information of players and push to screen
function getdescriptionofuser() {
  socket.on('descriptionuser', data => {
    updatelistuser(data)
  });
}

function updatelistuser(listdata) {
  $('#player1').empty()
  $('#player2').empty()
  $('#player3').empty()
  $('#player4').empty()
  $('#player5').empty()
  const mydata = JSON.parse(listdata)
  mydata.forEach((data) => {
    const player = "#player" + data.id
    $(player).append("Player " + data.id + ": " + data.name)
  });

}


//used to determine player's relative position on the board (A5 to E5) - NOT distance, does not change with elimination.
function getPlayerPosition(opponentPlayer, thisPlayer) {
  let playerDiff = opponentPlayer.id - thisPlayer.id;
  let position = "unavailable";
  console.log(playerDiff);

  switch (playerDiff) {
    case 0:
      position = "a5";
      break;
    case 1:
    case -4:
      position = "b5";
      break;
    case 2:
    case -3:
      position = "c5";
      break;
    case 3:
    case -2:
      position = "d5";
      break;
    case 4:
    case -1:
      position = "e5";
      break;
    default:
      position = "unavailable";
  }
  return position;
}

//will update handsize for all players (private hands) - mydata = set of player data, data=this player
function updateHandSizeDisplay(mydata, data) {
  mydata.forEach((player) => {
    let position = getPlayerPosition(player, data);
    if (position != "unavailable") {
      let divString = "";
      let handSize = player.hand["length"];
      //(update not applicable if position is this player's)
      if (position != "a1") {
        if (handSize >0) {
          divString += '<img src="assets/cardBack.png" class="responsive">';
          for (i = 1; i < handSize; i++) {
            divString += '<img src="assets/cardOverlap.png"class="responsive">';
          }
          let positionString = "#" + position + " .privateHand";
          $(positionString).html(divString);
        }
      }
    }
    else {
      alert("warning: position unable to be determined!");
    }
  });
}

function updateBulletDisplay(mydata, data) {
  $("#mainBullets").html(getBulletString(data));
  if (data.id == 1) {
    $("#c5 .bulletTray").html(getBulletString(mydata[2]));
    $("#b5 .bulletTray").html(getBulletString(mydata[1]));
    $("#d5 .bulletTray").html(getBulletString(mydata)[3]);
    $("#e5 .bulletTray").html(getBulletString(mydata)[4]);
  }
  else if (data.id == 2) {
    $("#c5 .bulletTray").html(getBulletString(mydata[3]));
    $("#b5 .bulletTray").html(getBulletString(mydata[2]));
    $("#d5 .bulletTray").html(getBulletString(mydata[4]));
    $("#e5 .bulletTray").html(getBulletString(mydata[0]));
  }
  else if (data.id == 3) {
    $("#c5 .bulletTray").html(getBulletString(mydata[4]));
    $("#b5 .bulletTray").html(getBulletString(mydata[3]));
    $("#d5 .bulletTray").html(getBulletString(mydata[0]));
    $("#e5 .bulletTray").html(getBulletString(mydata[1]));
  }
  else if (data.id == 4) {
    $("#c5 .bulletTray").html(getBulletString(mydata[0]));
    $("#b5 .bulletTray").html(getBulletString(mydata[4]));
    $("#d5 .bulletTray").html(getBulletString(mydata[1]));
    $("#e5 .bulletTray").html(getBulletString(mydata[2]));
  }
  else if (data.id == 5) {
    $("#c5 .bulletTray").html(getBulletString(mydata[1]));
    $("#b5 .bulletTray").html(getBulletString(mydata[0]));
    $("#d5 .bulletTray").html(getBulletString(mydata[2]));
    $("#e5 .bulletTray").html(getBulletString(mydata[3]));
  }
}
