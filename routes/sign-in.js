const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const utils = require('../utils');
const User = require('../models/user');
const Admin = require('../models/admin');

// GET http://localhost:3000/sign-in
router.get('/', (req, res) => {
    if (req.cookies.token) {
        res.redirect('/dashboard');
    } else if (req.cookies.token) {
        res.redirect('/dashboard-admin');
    } else {
        res.render('pages/sign-in/sign-in');
    }
});

// POST http://localhost:3000/sign-in
router.post('/', async (req, res) => {
    try {
        switch (req.body.email) {
            case 'admin@merchs.com': {
                // Check if the admin exists by email
                const admin = await Admin.exists(req.body.email);
                if (admin === null) {
                    res.render('pages/sign-in/sign-in', { error: 'Error in email or password' });
                }
                // Check password
                if (req.body.password !== admin.password) {
                    res.render('pages/sign-in/sign-in', { error: 'Error in email or password' });
                }
                // Login OK: create the token, store in cookies and redirect to Dashboard Admin
                else {
                    const token = utils.createToken(admin, 'admin');
                    res.cookie('token', token);
                    res.redirect('/dashboard-admin');
                }
            }
            default: {
                // Check if the user exists by email
                const user = await User.exists(req.body.email);
                if (user === null) {
                    res.render('pages/sign-in/sign-in', { error: 'Error in email or password' });
                }
                // Check password
                const checkPassword = bcrypt.compareSync(req.body.password, user.password);
                if (!checkPassword) {
                    res.render('pages/sign-in/sign-in', { error: 'Error in email or password' });
                }
                // Login OK: create the token, store in cookies and redirect to Dashboard
                else {
                    const token = utils.createToken(user, 'user');
                    res.cookie('token', token);
                    res.redirect('/dashboard');
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;