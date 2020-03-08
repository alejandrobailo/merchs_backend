const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');

const Supplier = require('../models/supplier');

// GET http://localhost:3000/sign-in
router.get('/', (req, res) => {
    res.render('../views/sign-in/sign-in');
});

// POST http://localhost:3000/sign-in
router.post('/', async (req, res) => {
    try {
        // Check email
        const user = await Supplier.emailExists(req.body.email);
        if (user === null) {
            res.render('../views/sign-in/sign-in', { error: 'Error in email or password' });
        }

        // Check password
        const checkPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!checkPassword) {
            res.render('../views/sign-in/sign-in', { error: 'Error in email or password' });
        }
        // Login OK: create the token and redirect to Dashboard
        else {
            console.log(createToken(user));
            res.redirect('/dashboard');
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
        expirationDate: moment().add(15, 'minutes').unix()
    }
    return jwt.encode(payload, process.env.SECRET_KEY);
}

module.exports = router;