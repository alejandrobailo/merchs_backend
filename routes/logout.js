const express = require('express');
const router = express.Router();

// GET http://localhost:3000/logout
router.get('/', (req, res) => {
    res.clearCookie('token');
    res.redirect('/sign-in');
});

module.exports = router;