const getAll = (userId) => {
    return new Promise((resolve, reject) => db.query('select * from brand where fk_username = ?', [userId], (err, rows) => {
        if (err) reject(err)
        resolve(rows);
    }));
};

module.exports = {
    getAll: getAll
}