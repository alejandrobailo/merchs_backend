const moment = require('moment');
const jwt = require('jwt-simple');

let formatDate = (date) => {
    return new Promise((resolve, reject) => {
        date = moment(date).format('DD/MM/YYYY');
        try {
            resolve(date);
        } catch (error) {
            reject(error)
        }
    });
}

const createToken = (user) => {
    const payload = {
        userId: user.id,
        creationDate: moment().unix(),
        expirationDate: moment().add(15, 'days').unix()
    }
    return jwt.encode(payload, process.env.SECRET_KEY);
}

module.exports = {
    formatDate: formatDate,
    createToken: createToken
}