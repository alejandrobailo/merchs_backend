const router = require('express').Router();
const Order = require('../../models/order');
const Customer = require('../../models/customer');
const Product = require('../../models/product');
var resultOrderId;

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
        // Creo un registro en la tabla Order con los datos del pedido
        const resultOrder = await Order.createOrder(req.body);
        resultOrderId = resultOrder.insertId;
        res.json(resultOrder);
    }
    catch (err) {
        console.log(err);
    }
});

// POST http://localhost:3000/api/orders/new/items
router.post('/new/items', async (req, res) => {
    try {
        // Obtengo la talla codificada como en la BBDD y la asigno al objeto que llega de la petición
        const sizeEncoded = await Product.getSizeEncoded(req.body.size);
        req.body.size = sizeEncoded[0].id;

        // Creo tantos registros en la tabla Product-Order (tbi) como items haya en el carrito
        const resultOrderProducts = await Order.createOrderProducts(resultOrderId, req.body);

        // Actualizo la tabla Size-Product con la cantidad correspondiente (resto la cantidad del item a la cantidad actual de la BBDD)
        await Product.updateProductQuantity(req.body);

        res.json(resultOrderProducts);
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;