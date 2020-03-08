const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const Supplier = require('../models/supplier');

// GET http://localhost:3000/sign-up
router.get('/', (req, res) => {
    res.render('../views/sign-up/sign-up');
});

// POST http://localhost:3000/sign-up/
router.post('/', [
    check('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 30 }).withMessage('Name should be between 3 and 30 characters'),
    check('address')
        .trim()
        .notEmpty().withMessage('Address is required'),
    check('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .isNumeric({ no_symbols: true }).withMessage('Phone should contain only numbers'),
    check('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .custom(value => { return (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(value) }).withMessage('Email should be valid'),
    check('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .custom(value => { return (/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/).test(value) }).withMessage('Password must contain at least one letter, at least one number, and be longer than six charaters')
], async (req, res) => {
    try {
        const validationErrors = validationResult(req);

        // Check if there are form errors
        if (!validationErrors.isEmpty()) {
            return res.render('../views/sign-up/sign-up', { errors: validationErrors.errors });
        }

        // Check if there is any other user with the same email address
        const emailExists = await Supplier.emailExists(req.body.email);
        if (emailExists !== null) {
            return res.render('../views/sign-up/sign-up', { emailRepeated: 'Email already in use' });
        }

        // If no errors in form and no email already used, encrypt the password and create the supplier in the DB
        req.body.password = bcrypt.hashSync(req.body.password, 10);
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