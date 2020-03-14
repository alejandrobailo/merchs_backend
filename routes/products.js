const express = require('express');
const router = express.Router();
const fs = require('fs');

const middleware = require('./middlewares');
const Product = require('../models/product');
const Brand = require('../models/brand');
const Size = require('../models/size');
const Category = require('../models/category');

/*
Lo comento para poder trabajar
router.use(middleware.checkToken); */

/* GET http://localhost:3000/products/ */
router.get('/', async (req, res) => {
    const rows = await Product.getAll();
    res.render('product/list', {
        products: rows
    });
});

/* GET http://localhost:3000/products/new */
router.get('/new', async (req, res) => {

    const brands = await Brand.getAll();
    const sizes = await Size.getAll();
    const categories = await Category.getAll();


    res.render('product/new', {
        brands: brands,
        categories: categories,
        sizes: sizes
    });
})


/* GET http://localhost:3000/products/edit/:sku */
router.get('/edit/:sku', async (req, res) => {
    const result = await Product.getById(req.params.sku);

    res.render('product/edit', {
        product: result[0]
    });
});


/* POST http://localhost:3000/products/create */
router.post('/create', async (req, res) => {
    console.log(req);
    const result = await Product.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        discount: req.body.discount,
        date: req.body.date,
        brand: req.body.brand,
        sizes: req.body.size,
        category: req.body.category
    });

    // Call to createSize method
    await Size.createSize(req.body.size, result.insertId);

    res.redirect('/products')
})

module.exports = router;