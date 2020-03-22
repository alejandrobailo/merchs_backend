const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Admin = require('../models/admin');

// GET http://localhost:3000/sign-up
router.get('/', (req, res) => {
    res.render('pages/sign-up/sign-up');
});

// POST http://localhost:3000/sign-up/
router.post('/', [
    check('username')
        .trim()
        .notEmpty().withMessage('Username is required'),
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
        .custom(value => { return (/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/).test(value) }).withMessage('Password must contain at least one letter, at least one number, and be longer than six characters'),
    check('confirmPassword')
        .trim()
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (req.body.password === req.body.confirmPassword) {
                return true;
            } else {
                return false;
            }
        }).withMessage('Passwords must match')
], async (req, res) => {
    try {
        const validationErrors = validationResult(req);

        // Check if there are form errors
        if (!validationErrors.isEmpty()) {
            return res.render('pages/sign-up/sign-up', { errors: validationErrors.errors });
        }

        // Check if there is any other user or admin with the same email address
        const emailExistsUser = await User.exists(req.body.email);
        const emailExistsAdmin = await Admin.exists(req.body.email);
        if (emailExistsUser !== null || emailExistsAdmin !== null) {
            return res.render('pages/sign-up/sign-up', { emailRepeated: 'Email already in use' });
        }

        // If no errors in form and no email already used, encrypt the password and create the User in the DB
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        await User.create({
            username: req.body.username,
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