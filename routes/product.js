const express = require("express");
const router = express.Router();
const Product = require("../models/product");

/* GET http://localhost:3000/products/ */
router.get("/", async (req, res, next) => {
  const rows = await Product.getAll();
  res.render("products/index", { products: rows });
});

module.exports = router;
