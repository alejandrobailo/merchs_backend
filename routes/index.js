const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');


// GET http://localhost:3000/dashboard
router.get('/dashboard', middleware.checkToken, (req, res) => {
  res.render('pages/dashboard/dashboard');
});

// GET http://localhost:3000/dashboard-admin
router.get('/dashboard-admin', middleware.checkToken, (req, res) => {
  res.render('pages/dashboard/dashboard-admin');
});

module.exports = router;