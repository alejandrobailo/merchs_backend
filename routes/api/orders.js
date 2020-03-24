const router = require('express').Router();
const Order = require('../../models/order');
const Customer = require('../../models/customer');

// GET http://localhost:3000/api/orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.getByCustomer(req.body.customerId, req.body.status);
        const customer = await Customer.getById(req.body.customerId);
        const products = [];

        for (order of orders) {
            products.push(await Order.getProductsInOrder(order.id));
        }

        const result = {
            customer,
            orders,
            products
        }

        res.json(result);
    }
    catch (err) {
        res.json(err);
    }
});

module.exports = router;