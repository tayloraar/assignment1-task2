
const display = require('../services/displayServices')

const displayGameBoard=(payload, res)=>
{
    display.displayGameBoard(payload, res)
}

module.exports = {
    displayGameBoard
}

  