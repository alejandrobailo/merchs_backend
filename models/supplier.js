const create = ({ name, address, phone, email, password }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO supplier (name, address, phone, email, password) VALUES (?, ?, ?, ?, ?)', [name, address, phone, email, password], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const emailExists = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM supplier WHERE email = ?', [email], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) return resolve(null);
            resolve(rows[0]);
        });
    });
}

module.exports = {
    create: create,
    emailExists: emailExists
}