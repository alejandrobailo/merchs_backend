const getAll = () => {
    return new Promise((resolve, reject) => db.query('select * from size', (err, rows) => {
        if (err) reject(err)
        resolve(rows);
    }));
};

const createSize = (sizes, productId) => {
    return new Promise((resolve, reject) => {
        sizes.forEach((size) => {
            db.query('insert into tbi_size_product (fk_product, fk_size) values (?, ?)',
                [productId, size], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
        });
    });
}

module.exports = {
    getAll: getAll,
    createSize: createSize
}