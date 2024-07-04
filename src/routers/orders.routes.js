const {Router} = require('express');
const OrdersController = require('../controllers/OrdersController');

const ordersRouter = new Router();
const ordersController = new OrdersController();


ordersRouter.post('/', ordersController.criar.bind(ordersController));

module.exports = ordersRouter;