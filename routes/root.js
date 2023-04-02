const rootController = require('../controller/root');

const routes = [
    {
        method: 'GET',
        url: '/api/getRaffles',
        handler: rootController.getRaffleList
    }, {
        method: 'GET',
        url: '/api/getRaffleById/:id',
        handler: rootController.getRaffleById
    }, {
        method: 'GET',
        url: '/api/getRandom/:max',
        handler: rootController.getRandomNumber
    }, {
        method: 'GET',
        url: '/api/getRandom/:max/:num',
        handler: rootController.getRandomNumber
    }, {
        method: 'GET',
        url: '/api/getUser/:id',
        handler: rootController.getRaffleUser
    }, {
        method: 'POST',
        url: '/api/createRaffle/',
        handler: rootController.createRaffle
    }, {
        method: 'POST',
        url: '/api/createUser/',
        handler: rootController.createUser
    }, {
        method: 'POST',
        url: '/api/saveRaffleWinners',
        handler: rootController.saveRaffleWinners
    }
]

module.exports = routes