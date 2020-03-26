const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');
const User = require('../models/user');
const Order = require('../models/order');
const Products = require('../models/product');




// GET http://localhost:3000/dashboard
router.get('/dashboard', middleware.checkTokenUser, async (req, res) => {

  const products = await Products.getAll(res.locals.user.id);
  res.locals.products = products;

  const rows = await Order.getMoneyMonth(res.locals.user.id);
  const arrMonths = [];
  const arrMoney = [];
  rows.forEach((item) => {
    arrMonths.push(item.month);
    arrMoney.push(item.money);
  })

  res.render('pages/dashboard/dashboard', {
    months: arrMonths,
    money: arrMoney,
    products: products
  });
});

module.exports = router;
