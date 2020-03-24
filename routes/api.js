const router = require('express').Router();

/* Routes */
const
    apiProductsRouter = require('./api/products');

/* Calls */
router.use('/products', apiProductsRouter);

module.exports = router;
