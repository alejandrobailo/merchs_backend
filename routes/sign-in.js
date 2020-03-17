const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('../models/user');
const Admin = require('../models/admin');

// GET http://localhost:3000/sign-in
router.get('/', (req, res) => {
    res.render('sign-in/sign-in');
});

// POST http://localhost:3000/sign-in
router.post('/', async (req, res) => {
    try {
        switch (req.body.email) {
            case 'admin@merchs.com': {
                // Check if the admin exists by email
                const admin = await Admin.exists(req.body.email);
                if (admin === null) {
                    res.render('sign-in/sign-in', { error: 'Error in email or password' });
                }
                // Check password
                if (req.body.password !== admin.password) {
                    res.render('sign-in/sign-in', { error: 'Error in email or password' });
                }
                // Login OK: create the token, store in cookies and redirect to Dashboard
                else {
                    const token = createToken(admin);
                    res.cookie('token_admin', token);
                    res.redirect('/admin-dashboard');
                }
            }
            default: {
                // Check if the user exists by email
                const user = await User.exists(req.body.email);
                if (user === null) {
                    res.render('sign-in/sign-in', { error: 'Error in email or password' });
                }
                // Check password
                const checkPassword = bcrypt.compareSync(req.body.password, user.password);
                if (!checkPassword) {
                    res.render('sign-in/sign-in', { error: 'Error in email or password' });
                }
                // Login OK: create the token, store in cookies and redirect to Dashboard
                else {
                    const token = createToken(user);
                    res.cookie('token_user', token);
                    res.redirect('/dashboard');
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

// Support functions
const createToken = (pUser) => {
    const payload = {
        userId: pUser.id,
        creationDate: moment().unix(),
        expirationDate: moment().add(15, 'days').unix()
    }
    return jwt.encode(payload, process.env.SECRET_KEY);
}

module.exports = router;