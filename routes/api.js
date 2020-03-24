const router = require('express').router();

/* Routes */
const
    apiProductsRouter = require('.api/products');

/* Calls */
router.use('/products', apiProductsRouter);

