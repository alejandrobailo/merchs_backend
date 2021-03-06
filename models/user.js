const create = ({ username, address, phone, email, password }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO user (username, address, phone, email, password) VALUES (?, ?, ?, ?, ?)', [username, address, phone, email, password], (err, result) => {
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

const editById = ({ username, address, phone, email, password }, userId) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE user SET username = ?, address = ?, phone = ?, email = ?, password = ? WHERE id = ?', [username, address, phone, email, password, userId], (err, result) => {
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