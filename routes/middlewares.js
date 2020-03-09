const jwt = require('jwt-simple');
const moment = require('moment');

const checkToken = (req, res, next) => {
    // 1. Check if token exists in the user cookies
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
        return res.redirect('/sign-in');
    }

    // 3. Check if the token has expired
    const currentDate = moment().unix();
    if (currentDate > payload.expirationDate) {
        return res.redirect('/sign-in');
    }

    // 4. Allow request in any other case
    next();
}

module.exports = {
    checkToken: checkToken
}