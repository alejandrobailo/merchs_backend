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

const create = ({ title, price, discount, description, brand, category }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into product (title, price, discount, date, description, fk_brand, fk_category) values (?, ?, ?, ?, ?, ?, ?)',
            [title, price, discount, new Date(), description, brand, category],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    });
}

// const createSizes = ()

module.exports = {
    getAll: getAll,
    create: create
}