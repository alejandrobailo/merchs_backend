const router = require('express').Router();

/* Routes */
const apiProductsRouter = require('./api/products');
const apiOrdersRouter = require('./api/orders');

/* Calls */
router.use('/products', apiProductsRouter);
router.use('/orders', apiOrdersRouter);

module.exports = router;
