const router = require('express').Router();

/* Imports */
const Product = require('../../models/product')

/* GET http://localhost:3000/api/products */
router.get('/', async (req, res) => {
    const rows = await Product.getAllApi();
    /*     for (row of rows) {
            const category = await Product.getProductCategories(row.sku);
            if (category.length !== 0) {
                row.categories = [];
                for (item of category) {
                    row.categories.push(item.name);
                }
            };
        } */
    res.json(rows);
});

module.exports = router;
