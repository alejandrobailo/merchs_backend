const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const middleware = require('./middlewares');
const Product = require('../models/product');
const Brand = require('../models/brand');
const Size = require('../models/size');
const Category = require('../models/category');
const utils = require('../utils');
const User = require('../models/user');

/* IMAGES */
/* Al encapsular la función de insertar imagenes ya no se necesitan aquí, ELIMINAR EN UN FUTURO CERCANO
const path = require('path')
const fs = require('fs'); 
*/
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
// Para que el formulario funcione necesita multipart() como middleware, se la pasamos como 2º parametro a la funcion POST
// Esta libreria crea los headers necesarios para que el formulario mande la img.

router.use(middleware.checkTokenUser);

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
    res.render('pages/product/list', {
        products: rows,
    });
});

/* GET http://localhost:3000/products/new */
router.get('/new', async (req, res) => {
    const brands = await Brand.getAll();
    const sizes = await Size.getAll();
    const categories = await Category.getAll();

    res.render('pages/product/new', {
        brands: brands,
        categories: categories,
        sizes: sizes
    });
})

/* GET http://localhost:3000/products/edit/:sku */
router.get('/edit/:sku', async (req, res) => {
    const result = await Product.getById(req.params.sku);
    const formatDate = await utils.formatDate(result[0].date);
    const sizes = await Size.getById(req.params.sku);

    res.render('pages/product/edit', {
        product: result[0],
        date: formatDate,
        sizes: sizes
    });
});

/* GET http://localhost:3000/products/delete/:sku */
router.get('/delete/:sku', async (req, res) => {
    await Product.deleteById(req.params.sku);
    await Size.deleteById(req.params.sku);
    await Category.deleteById(req.params.sku);
    try {
        res.redirect(`/products`);
    } catch (error) {
        console.log(err);
    }
})

/* POST http://localhost:3000/products/create */
router.post('/create', multipartMiddleware, [
    check('title')
        .trim()
        .isLength({ min: 3 }).withMessage('Min. number of characters are 3')
        .notEmpty().withMessage('Title is required'),
    check('price')
        .trim()
        .isNumeric(({ no_symbols: true }))
        .notEmpty().withMessage('Price is required'),
    check('description')
        .isLength({ min: 10 }).withMessage('Min. number of characters are 10')
        .notEmpty().withMessage('Description is required'),
    check('discount')
        .trim()
        .isNumeric(({ no_symbols: true }))
        .isLength({ max: 2 }).withMessage('Max. number of characters are 2'),
], async (req, res) => {

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const brands = await Brand.getAll();
        const sizes = await Size.getAll();
        const categories = await Category.getAll();
        return res.render('pages/product/new', {
            errors: validationErrors.errors,
            brands: brands,
            categories: categories,
            sizes: sizes
        });
    }

    const result = await Product.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        discount: req.body.discount,
        date: req.body.date,
        brand: req.body.brand
    });
    // Creating tbi_size_product relations
    await Size.createSizesRelation(req.body.sizes, result.insertId);
    // Creating tbi_category_product relations
    await Category.createCategoryRelation(req.body.categories, result.insertId);
    // Insert img to db and creating files
    if (req.files.image.length > 1) {
        for (item of req.files.image) {
            utils.insertImage(result.insertId, item);
        }
    } else utils.insertImage(result.insertId, req.files.image)
    res.redirect('/products');
});

/* POST http://localhost:3000/products/edit/:sku */
router.post('/edit/:sku', [
    check('title')
        .trim()
        .isLength({ min: 3 }).withMessage('Min. number of characters are 3'),
    check('price')
        .trim()
        .isNumeric(({ no_symbols: true })),
    check('description')
        .isLength({ min: 10 }).withMessage('Min. number of characters are 10'),
    check('discount')
        .trim()
        .isNumeric(({ no_symbols: true }))
], async (req, res) => {

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        const result = await Product.getById(req.params.sku);
        const formatDate = await utils.formatDate(result[0].date);
        const sizes = await Size.getById(req.params.sku);

        return res.render('pages/product/edit', {
            errors: validationErrors.errors,
            product: result[0],
            date: formatDate,
            sizes: sizes

        });
    }

    await Product.editById(req.body, req.params.sku);

    if (req.body.sizes != '[{}]') {
        await Size.editById(req.body.sizes, req.params.sku);
    }
    try {
        res.redirect(`/products`);
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;