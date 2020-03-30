const router = require('express').Router();

/* Imports */
const Product = require('../../models/product')
const Size = require('../../models/size');
const Category = require('../../models/category');

/* GET http://localhost:3000/api/products */
router.get('/', async (req, res) => {
    const rows = await Product.getAllApi();
    res.json(rows);
});

/* GET http://localhost:3000/api/products/:sku */
router.get('/:sku', async (req, res) => {
    const result = {
        product: await Product.getById(req.params.sku),
        sizes: await Size.getById(req.params.sku),
        categories: await Category.getById(req.params.sku)
    }
    res.json(result);
});

module.exports = router;
