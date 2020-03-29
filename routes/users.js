const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const utils = require('../utils');
const User = require('../models/user');


// GET http://localhost:3000/users
router.get('/', middleware.checkToken, async (req, res) => {
    try {
        if (res.locals.admin) {
            const rows = await User.getAll();
            for (let row of rows) {
                row.date = await utils.formatDate(row.date);
            }
            res.render('pages/users/list', { users: rows });
        } else {
            res.redirect('/dashboard');
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.use(middleware.checkToken);

// GET http://localhost:3000/users/edit
router.get('/edit', async (req, res) => {
    try {
        res.render('pages/users/edit');
    }
    catch (err) {
        console.log(err);
    }
});

// GET http://localhost:3000/users/delete/:id
router.get('/delete/:id', async (req, res) => {
    try {
        await User.deleteById(req.params.id);
        res.redirect('/users');
    }
    catch (err) {
        console.log(err);
    }
});

// POST http://localhost:3000/users/edit
router.post('/edit', [
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
],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.render('pages/users/edit', { errors: validationErrors.errors });
            }

            req.body.password = bcrypt.hashSync(req.body.password, 10);
            await User.editById(req.body, res.locals.user.id);
            res.redirect('/dashboard');
        }
        catch (err) {
            console.log(err);
        }
    });

module.exports = router;