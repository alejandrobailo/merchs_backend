var express = require('express');
var router = express.Router();

// GET http://localhost:3000/dashboard
router.get('/dashboard', (req, res) => {
  const cookies = req.cookies.token_user;
  console.log('hola', cookies);
  res.render('pages/index');
});

module.exports = router;
