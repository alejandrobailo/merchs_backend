const router = require('express').Router();

/* Routes */
const apiProductsRouter = require('./api/products');
const apiOrdersRouter = require('./api/orders');
const apiLoginRouter = require('./api/login');


/* Calls */
router.use('/products', apiProductsRouter);
router.use('/orders', apiOrdersRouter);
router.use('/login', apiLoginRouter);

module.exports = router;
