const create = ({ name, address, phone, email, password }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO user (name, address, phone, email, password) VALUES (?, ?, ?, ?, ?)', [name, address, phone, email, password], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const exists = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE email = ?', [email], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) return resolve(null);
            resolve(rows[0]);
        });
    });
};

const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user', (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const getById = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE id = ?', [userId], (err, row) => {
            if (err) return reject(err);
            resolve(row[0]);
        });
    });
};

const editById = ({ name, address, phone, email }, userId) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE user SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?', [name, address, phone, email, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const deleteById = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user WHERE id = ?', [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    create: create,
    exists: exists,
    getAll: getAll,
    getById: getById,
    editById: editById,
    deleteById: deleteById
}