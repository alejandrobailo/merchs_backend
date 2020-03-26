const router = require('express').Router();
const Order = require('../../models/order');
const Customer = require('../../models/customer');

// GET http://localhost:3000/api/orders
router.get('/', async (req, res) => {
    try {
        const customer = await Customer.getById(req.body.customerId);
        const orders = await Order.getOrdersByCustomer(req.body.customerId);

        for (order of orders) {
            order.product = await Order.getProductsInOrder(order.id);
        }

        const result = {
            customer,
            orders
        }

        res.json(result);
    }
    catch (err) {
        res.json(err);
    }
});

module.exports = router;