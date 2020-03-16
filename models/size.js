const getAll = () => {
    return new Promise((resolve, reject) => db.query('select * from size', (err, rows) => {
        if (err) reject(err)
        resolve(rows);
    }));
};

/* const createSize = (sizes, productId) => {
    return new Promise((resolve, reject) => {
        sizes.forEach((size) => {
            db.query('insert into tbi_size_product (fk_product, fk_size) values (?, ?)',
                [productId, size], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
        });
    });
} */

const createSizes = (sizesQuantities, productId) => {
    return new Promise((resolve, reject) => {
        JSON.parse(sizesQuantities);
        console.log(sizesQuantities);

        sizesQuantities.forEach((item) => {
            db.query('insert into tbi_size_product (fk_product, fk_size, quantity) values (?, ?, ?)',
                [productId, item.size, item.quantity], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
        });
    });
}



module.exports = {
    getAll: getAll,
    // createSize: createSize
    createSizes: createSizes
}