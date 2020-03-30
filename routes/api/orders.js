const router = require('express').Router();
const Order = require('../../models/order');
const Customer = require('../../models/customer');

// POST http://localhost:3000/api/orders
router.post('/', async (req, res) => {
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

// POST http://localhost:3000/api/orders/new
router.post('/new', async (req, res) => {
    try {
        const resultOrder = await Order.createOrder(req.body);
        console.log(req.body);
        const resultOrderProducts = await Order.createOrderProducts(resultOrder.insertId, req.body);
        res.json(resultOrderProducts);
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;