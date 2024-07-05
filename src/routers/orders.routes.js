const {Router} = require('express');
const OrdersController = require('../controllers/OrdersController');

const ordersRouter = new Router();
const ordersController = new OrdersController();

ordersRouter.post('/', ordersController.criar.bind(ordersController));
ordersRouter.get('/:id', ordersController.listar.bind(ordersController));


module.exports = ordersRouter;