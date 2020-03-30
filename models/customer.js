// Function for the API
const getById = (customerId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from customer WHERE id = ?', [customerId], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

const emailPassExists = (email, pass) => {
    return new Promise((resolve, reject) => {
        db.query('select * from customer where email = ? and password = ?', [email, pass], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) return resolve(null)
            else resolve(rows[0])
        });
    });
}

module.exports = {
    getById: getById,
    emailPassExists: emailPassExists
}