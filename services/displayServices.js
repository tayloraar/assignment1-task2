//hides the join screen and displays the gameboard
const displayGameBoard=()=> {
    $("#gameboard").removeClass("hidden");
    $("#welcomeScreen").addClass("hidden");
}

//hides the gameboard & shows the join screen
const displayWelcomeScreen=()=> {
    $("#welcomeScreen").removeClass("hidden");
    $("#gameboard").addClass("hidden");
}

//gets player position (used to determine which card/bullets to adjust on screen)
function getPlayerPosition(opponentPlayerNum, thisPlayerNum) {
    let playerDiff = opponentPlayerNum - thisPlayerNum;
    let position = "unavailable";

    switch (playerDiff) {
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

//displays an opponents handsize on screen - needs size, opponent player number & current player number
const displayHandSize=(handSize, opponentPlayerNum, thisPlayerNum) =>{
    let position = getPlayerPosition(opponentPlayerNum, thisPlayerNum);
    if (position != "unavailable") {

        let divString = "";
        if (handSize > 0) {
            divString += '<img src="assets/cardBack.png" class="responsive">';
            for (i = 1; i < handSize; i++) {
                divString += '<img src="assets/cardOverlap.png"class="responsive">';
            }
            let jqString = '#' + position + ' .privateHand';
            $(jqString).html(divString);
        }
    } else {
    alert("error encountered: hand size not available");
    }
}

module.exports={
    displayHandSize,
    displayGameBoard,
    displayWelcomeScreen
}

/*
in file to use...
const display = require('../services/displayServices')
then:
display.displayGameBoard, etc, in code 

eg.
$(document).ready(function () {
    display.displayGameBoard();
    display.displayHandSize(1, 5, 2);
})
*/