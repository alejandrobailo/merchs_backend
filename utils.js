const moment = require('moment');

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

module.exports = {
    formatDate: formatDate
}