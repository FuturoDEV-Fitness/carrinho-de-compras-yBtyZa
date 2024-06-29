const {Router} = require('express');
const ClientesController = require('../controllers/ClientesController');

const clientesRouter = new Router();
const clientesController = new ClientesController();


clientesRouter.post('/', clientesController.criar.bind(clientesController));

module.exports = clientesRouter;

