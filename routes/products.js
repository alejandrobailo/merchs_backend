const express = require('express');
const router = express.Router();
const Product = require('../models/product');

/* GET http://localhost:3000/products/ */
router.get('/', async (req, res) => {
    const rows = await Product.getAll();
    res.render('product/list', { products: rows });
});

/* GET http://localhost:3000/products/new */
router.get('/new', (req, res) => {
    res.render('product/new');
})

/* POST http://localhost:3000/products/create */
router.post('/create', async (req, res) => {
    console.log(req.body);
    const result = await Product.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        discount: req.body.discount,
        date: req.body.date
    });
    console.log(result);
    res.redirect('/products')
})

module.exports = router;