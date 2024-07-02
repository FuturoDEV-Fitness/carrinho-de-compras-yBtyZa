const {Router} = require('express');
const ProductsController = require('../controllers/ProductController');

const productsRouter = new Router();
const productsController = new ProductsController();

productsRouter.post('/', productsController.criar.bind(productsController));
productsRouter.get('/', productsController.listar.bind(productsController));

module.exports = productsRouter;