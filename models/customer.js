const getById = (customerId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from customer WHERE id = ?', [customerId], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

module.exports = {
    getById: getById
}