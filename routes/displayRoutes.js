const Express = require('express');
let router = Express.Router();
const controller = require('../controllers/documentController');

router.get('/displayGameBoard', (req, res) => {
    console.log('Got to displayGameboard');
    controller.displayGameBoard(req, res);
})

module.exports = {
    displayRouter: router
}