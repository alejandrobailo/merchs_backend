const create = ({ name, address, phone, email, password }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO supplier (name, address, phone, email, password) VALUES (?, ?, ?, ?, ?)', [name, address, phone, email, password], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getByEmailandPassword = (pEmail, pPassword) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM supplier WHERE email = ? AND password = ?', [pEmail, pPassword], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    create: create,
    getByEmailandPassword: getByEmailandPassword
}