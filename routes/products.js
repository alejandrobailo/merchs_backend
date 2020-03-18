const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');
const Product = require('../models/product');
const Brand = require('../models/brand');
const Size = require('../models/size');
const Category = require('../models/category');
const utils = require('../utils');

/*
Lo comento para poder trabajar
router.use(middleware.checkTokenUser); */

/* GET http://localhost:3000/products/ */
router.get('/', async (req, res) => {
    const rows = await Product.getAll();
    for (row of rows) {
        const category = await Product.getProductCategories(row.sku);
        // If categories are assigned, add the property to the product
        if (category.length !== 0) {
            row.categories = [];
            for (item of category) {
                row.categories.push(item.name);
            }
        }
    }
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

    const formatDate = await utils.formatDate(result[0].date);

    res.render('product/edit', {
        product: result[0],
        date: formatDate
    });
});


/* POST http://localhost:3000/products/create */
router.post('/create', async (req, res) => {
    const result = await Product.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        discount: req.body.discount,
        date: req.body.date,
        // brand: req.body.brand,
        // category: req.body.Category
    });

    // Creating tbi_size_product relations
    await Size.createSizesRelation(req.body.sizes, result.insertId);

    // Creating tbi_brand_product relations
    await Brand.createBrandRelation(req.body.brand, result.insertId);

    // Creating tbi_category_product relations
    await Category.createCategoryRelation(req.body.categories, result.insertId);

    res.redirect('/products')
})

module.exports = router;