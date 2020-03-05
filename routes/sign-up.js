const express = require('express');
const router = express.Router();

const Supplier = require('../models/supplier');

// GET http://localhost:3000/sign-up
router.get('/', (req, res) => {
    res.render('../views/sign-up/sign-up');
});

// POST http://localhost:3000/sign-up/new
router.post('/new', async (req, res) => {
    try {
        await Supplier.create({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
        });
        res.redirect('/sign-in');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;