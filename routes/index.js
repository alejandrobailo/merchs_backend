const express = require('express');
const router = express.Router();
const path = require('path');
const middleware = require('./middlewares');
const Order = require('../models/order');
const Products = require('../models/product');

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../main/index.html'));
});

// GET http://localhost:3000/dashboard
router.get('/dashboard', middleware.checkToken, async (req, res) => {
  const products = await Products.getAll(res.locals.user.id);
  res.locals.products = products;

  /* Chart line */
  const rows = await Order.getMoneyMonth(res.locals.user.id);
  const arrMonths = [];
  const arrMoney = [];
  rows.forEach((item) => {
    arrMonths.push(item.month);
    arrMoney.push(item.money);
  })

  /* Chart pie */
  const results = await Order.getProductsOrderedByBrand(res.locals.user.id)
  const arrData = []

  results.forEach((item) => {
    const data = {}
    data.name = item.name;
    data.y = parseInt(item.numProds);
    arrData.push(data)
  })

  res.render('pages/dashboard/dashboard', {
    months: arrMonths,
    money: arrMoney,
    dataPie: arrData,
    products: products
  });
});

// GET http://localhost:3000/dashboard-admin
router.get('/dashboard-admin', middleware.checkToken, (req, res) => {
  res.render('pages/dashboard/dashboard-admin');
});

module.exports = router;