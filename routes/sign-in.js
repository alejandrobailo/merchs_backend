const express = require('express');
const router = express.Router();

const Supplier = require('../models/supplier');

// GET http://localhost:3000/sign-in
router.get('/', (req, res) => {
    res.render('../views/sign-in/sign-in');
});

// POST http://localhost:3000/sign-in
router.post('/', async (req, res) => {
    try {
        const rows = await Supplier.getByEmailandPassword(req.body.email, req.body.password);
        if (rows.length > 0) {
            res.redirect('/dashboard');
        } else {
            res.send('Invalid Email or Password');
        }
    }
    catch (err) {
        console.log(err);
    }
});


module.exports = router;