const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.clearCookie('token_user');
    res.render('logout/logout');
});

module.exports = router;