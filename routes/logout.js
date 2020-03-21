const express = require('express');
const router = express.Router();

// GET http://localhost:3000/logout
router.get('/', (req, res) => {
    res.clearCookie('token_user');
    res.clearCookie('token_admin');
    res.redirect('/sign-in');
});

module.exports = router;