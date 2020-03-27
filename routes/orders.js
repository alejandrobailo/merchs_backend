const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');
const Order = require('../models/order');
const utils = require('../utils');

router.use(middleware.checkToken);

// GET http://localhost:3000/orders
router.get('/', async (req, res) => {
    if (res.locals.user) {
        var orders = await Order.getOrdersByUser(res.locals.user.id);
    }
    else {
        var orders = await Order.getAllOrders();
    }

    for (order of orders) {
        order.order_date = await utils.formatDate(order.order_date);
        order.first_name = order.first_name + ' ' + order.last_name;
    }
    res.render('pages/orders/list', { orders: orders });
});

// GET http://localhost:3000/orders/:id
router.get('/:id', async (req, res) => {
    res.render('pages/orders/details', {});
});

module.exports = router;