const express = require('express');
const router = express.Router();
const middleware = require('./middlewares');
const utils = require('../utils');
const User = require('../models/user');

router.use(middleware.checkTokenAdmin);

// GET http://localhost:3000/users
router.get('/', async (req, res) => {
    try {
        const rows = await User.getAll();
        for (let row of rows) {
            row.date = await utils.formatDate(row.date);
        }
        res.render('users/list', { users: rows });
    }
    catch (err) {
        console.log(err);
    }
});

router.use(middleware.checkTokenUser);

// GET http://localhost:3000/users/edit/:id
router.get('/edit/:id', async (req, res) => {
    try {
        const row = await User.getById(req.params.id);
        res.render('users/edit', { user: row });
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

// POST http://localhost:3000/users/edit/:id
router.post('/edit/:id', async (req, res) => {
    try {
        await User.editById(req.body, req.params.id);
        res.redirect('/users');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;