const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');
const User = require('../models/user');

// GET http://localhost:3000/dashboard
router.get('/dashboard', middleware.checkTokenUser, async (req, res) => {
  const user = await User.getById(req.payload.userId);
  res.render('pages/dashboard/dashboard', { user: user });
});

module.exports = router;
