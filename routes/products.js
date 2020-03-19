const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');
const Product = require('../models/product');
const Brand = require('../models/brand');
const Size = require('../models/size');
const Category = require('../models/category');
const utils = require('../utils');

/* IMAGES */
const path = require('path')
const fs = require('fs');
const multipart = require('connect-multiparty');
/*  */

// Para que el formulario funcione necesita multipart() como middleware, se la pasamos como 2º parametro a la funcion POST
// Esta libreria crea los headers necesarios para que el formulario mande la img.
const multipartMiddleware = multipart();
//

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
router.post('/create', multipartMiddleware, async (req, res) => {

    const result = await Product.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        discount: req.body.discount,
        date: req.body.date,
        brand: req.body.brand
        // category: req.body.Category
    });

    // Creating tbi_size_product relations
    await Size.createSizesRelation(req.body.sizes, result.insertId);

    // Creating tbi_category_product relations
    req.body.categories = JSON.parse(req.body.categories);
    for (item of req.body.categories) {
        console.log(item);
        await Category.createCategoryRelation(item, result.insertId);
    }

    // Images:
    let dir = `./public/images/${result.insertId}/`
    // Nuevo directorio
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    // Number of images in the folder:
    let imageNumber = 0;
    let files = 0;

    if (req.files.image.length > 1) {
        for (item of req.files.image) {
            files = fs.readdirSync(dir).length;
            imageNumber = files + 1;
            // Ruta temporal:
            let pathFile = item.path;
            // Como vamos a llamar a la imagen en el server
            let newPath = dir + imageNumber + path.extname(pathFile).toLowerCase();
            // La guardamos
            fs.createReadStream(pathFile).pipe(fs.createWriteStream(newPath));
            //Le damos un nombre para la DB
            let imageName = '/images/' + result.insertId + '/' + imageNumber + path.extname(pathFile).toLowerCase();
            await Product.imgToDb(imageName, imageNumber, result.insertId);
        }
    } else {
        files = fs.readdirSync(dir).length;
        imageNumber = files + 1;
        // Ruta temporal:
        let pathFile = req.files.image.path;
        // Como vamos a llamar a la imagen en el server
        let newPath = dir + imageNumber + path.extname(pathFile).toLowerCase();
        // La guardamos
        fs.createReadStream(pathFile).pipe(fs.createWriteStream(newPath));
        //Le damos un nombre para la DB
        let imageName = '/images/' + result.insertId + '/' + imageNumber + path.extname(pathFile).toLowerCase();
        await Product.imgToDb(imageName, imageNumber, result.insertId);
    }
    res.redirect('/products');
});

module.exports = router;