const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');
const Order = require('../models/order');

router.use(middleware.checkTokenUser);

// GET http://localhost:3000/orders
router.get('/', async (req, res) => {
    const orders = await Order.getOrdersByUser(res.locals.user.id);
    for (order of orders) {
        // console.log(order);
        order.product = await Order.getProductsInOrder(order.id);
    }
    console.log(orders);
    res.render('pages/orders/orders', { orders: orders });
});

module.exports = router;