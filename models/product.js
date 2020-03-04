/* All products */

const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('select * from product', (err, rows) => {
            if (err) reject(err)
            resolve(rows);
        });
    });
};

/* Create product */

const create = ({ title, price, discount, brand, size, description }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into product (title, price, discount, date, description) values (?, ?, ?, ?, ?)',
            [title, price, discount, new Date(), description],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
    })
}

module.exports = {
    getAll: getAll,
    create: create
}