const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('../models/user');
const Admin = require('../models/admin');

const checkToken = async (req, res, next) => {
    // 1. Check if token exists in the cookies
    if (!req.cookies.token) {
        return res.redirect('/sign-in');
    }

    // 2. Check if the token is correct (can be decoded)
    const token = req.cookies.token;
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

    // 4. Get the user or admin in locals in order to use it in all the views (for the topnav, sidenav, users, products, ...)
    if (payload.adminId) {
        const admin = await Admin.getById(payload.adminId);
        res.locals.admin = admin;
    } else {
        const user = await User.getById(payload.userId);
        res.locals.user = user;
    }

    // 5. Pass the payload to the req object to use it in the next requests after middleware is used
    req.payload = payload;

    // 6. Allow request in any other case
    next();
}

module.exports = {
    checkToken: checkToken
}