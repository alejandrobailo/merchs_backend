const create = ({ name, address, phone, email, password }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO supplier (name, address, phone, email, password) VALUES (?, ?, ?, ?, ?)', [name, address, phone, email, password], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    create: create
}