const exists = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM admin WHERE email = ?', [email], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) return resolve(null);
            resolve(rows[0]);
        });
    });
};

module.exports = {
    exists: exists
}