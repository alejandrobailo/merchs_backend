const express = require('express');
const router = express.Router();

// GET http://localhost:3000/dashboard
router.get('/dashboard', (req, res) => {
  res.render('pages/dashboard/dashboard');
});

module.exports = router;
