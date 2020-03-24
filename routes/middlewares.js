const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('../models/user');
const Admin = require('../models/admin');

const checkTokenUser = (req, res, next) => {
    // 1. Check if token exists in the user cookies
    if (!req.cookies.token_user) {
        return res.redirect('/sign-in');
    }

    // 2. Check if the token is correct (can be decoded)
    const token = req.cookies.token_user;
    let payload = null;
    try {
        payload = jwt.decode(token, process.env.SECRET_KEY);
    }
    catch (err) {
        console.log(err);
        return res.redirect('/sign-in');
    }

    // 3. Check if the token has expired
    const currentDate = moment().unix();
    if (currentDate > payload.expirationDate) {
        return res.redirect('/sign-in');
    }

    // 4. Get the user in locals in order to use it in all the views (for the topnav)
    const user = User.getById(payload.userId);
    res.locals.user = user;

    // 5. Pass the payload to the req objecto to use it in the next requests after middleware is used
    req.payload = payload;

    // 6. Allow request in any other case
    next();
}

const checkTokenAdmin = (req, res, next) => {
    // 1. Check if token exists in the user cookies
    if (!req.cookies.token_admin) {
        return res.redirect('/sign-in');
    }

    // 2. Check if the token is correct (can be decoded)
    const token = req.cookies.token_admin;
    let payload = null;
    try {
        payload = jwt.decode(token, process.env.SECRET_KEY);
    }
    catch (err) {
        return res.redirect('/sign-in');
    }

    // 3. Check if the token has expired
    const currentDate = moment().unix();
    if (currentDate > payload.expirationDate) {
        return res.redirect('/sign-in');
    }

    // 4. Get the admin in locals in order to use it in all the views (for the topnav)
    const admin = Admin.getById(payload.userId);
    res.locals.admin = admin;

    // 5. Pass the payload to the req objecto to use it in the next requests after middleware is used
    req.payload = payload;

    // 6. Allow request in any other case
    next();
}

module.exports = {
    checkTokenUser: checkTokenUser,
    checkTokenAdmin: checkTokenAdmin
}